"""
ClipForge AI Video Studio - Backend Server
Supports real video downloading via yt-dlp, FFmpeg 9:16 vertical conversion,
real short generation, and video streaming.
"""

import os
import sys
import json
import time
from flask import Flask, request, jsonify, send_from_directory, send_file
import video_engine

# Reconfigure stdout/stderr encoding for Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')
SHORTS_DIR = os.path.join(BASE_DIR, 'generated_shorts')
os.makedirs(SHORTS_DIR, exist_ok=True)

app = Flask(__name__, static_folder='.', static_url_path='')

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

@app.route('/')
def root():
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return send_from_directory('.', 'index.html')

@app.route('/assets/<path:path>')
def serve_dist_assets(path):
    if os.path.exists(DIST_DIR):
        assets_dir = os.path.join(DIST_DIR, 'assets')
        if os.path.exists(os.path.join(assets_dir, path)):
            return send_from_directory(assets_dir, path)
    return send_from_directory('.', path)

@app.route('/<path:path>')
def static_files(path):
    if os.path.exists(DIST_DIR):
        candidate = os.path.join(DIST_DIR, path)
        if os.path.exists(candidate) and not os.path.isdir(candidate):
            return send_from_directory(DIST_DIR, path)
    return send_from_directory('.', path)

@app.route('/generated_shorts/<filename>')
def serve_generated_short(filename):
    file_path = os.path.join(SHORTS_DIR, filename)
    if os.path.exists(file_path):
        # Allow video streaming with range headers and proper mimetype
        mimetype = 'image/jpeg' if filename.endswith('.jpg') else 'video/mp4'
        return send_file(file_path, mimetype=mimetype)
    return jsonify({"error": "File not found"}), 404

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "cluster": "ClipForge GPU Cluster (Active)",
        "capabilities": ["yt-dlp", "ffmpeg-v7", "multi-clip-9:16", "mp4-export"],
        "ffmpeg_path": video_engine.FFMPEG_EXE,
        "timestamp": time.time()
    })

@app.route('/api/generate_real_short', methods=['POST', 'OPTIONS'])
def generate_real_short():
    """
    Downloads and converts a real video into a 9:16 short using yt-dlp & FFmpeg.
    """
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    data = request.json or {}
    url = data.get('url', '').strip()
    start_time = data.get('start_time', '00:00:05')
    
    raw_dur = data.get('duration', 15)
    try:
        duration = int(raw_dur)
    except (ValueError, TypeError):
        duration = 15
        
    caption = data.get('caption', 'THE EXACT BLUEPRINT')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    result = video_engine.download_and_create_short(url, start_time=start_time, duration=duration, caption=caption)
    return jsonify(result)

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze_video():
    """
    Extracts stream metadata and generates multiple DISTINCT 9:16 MP4 shorts from different segments.
    """
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    data = request.json or {}
    url = data.get('url', '').strip()
    if not url:
        url = "https://youtube.com/watch?v=dQw4w9WgXcQ"

    caption_style = data.get('caption_style', 'Hormozi Bold')
    
    raw_duration = data.get('duration', 15)
    try:
        target_duration = int(raw_duration)
    except (ValueError, TypeError):
        target_duration = 15

    raw_count = data.get('count', 6)
    try:
        count = int(raw_count)
    except (ValueError, TypeError):
        count = 6

    # Generate multiple distinct real 9:16 shorts from different parts of the video
    result = video_engine.download_and_create_multi_shorts(
        url,
        caption_style=caption_style,
        target_duration=target_duration,
        count=count
    )

    return jsonify(result)

if __name__ == '__main__':
    port = 8888
    print(f"Starting ClipForge AI Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
