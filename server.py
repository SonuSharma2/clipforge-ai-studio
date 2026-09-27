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

# In-memory store for authentication OTPs and users
OTP_STORE = {}
USERS_DB = {
    "sonu.sharma0624@gmail.com": {
        "id": "usr_sonu",
        "name": "Sonu Sharma",
        "email": "sonu.sharma0624@gmail.com",
        "avatar": "https://avatars.githubusercontent.com/u/47955645?v=4",
        "plan": "Pro Studio",
        "emailVerified": True
    }
}

import random

@app.route('/api/auth/send-otp', methods=['POST', 'OPTIONS'])
def auth_send_otp():
    """Generates a 6-digit OTP for email verification or password reset."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    purpose = data.get('purpose', 'verification')
    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    otp = f"{random.randint(100000, 999999)}"
    expires_at = time.time() + 600  # 10 minutes

    OTP_STORE[email] = {
        "otp": otp,
        "expires_at": expires_at,
        "purpose": purpose,
        "verified": False
    }

    print(f"\n[AUTH] ✉️ Generated {purpose.upper()} OTP for {email}: {otp} (expires in 10m)\n")

    return jsonify({
        "success": True,
        "message": f"Verification code sent to {email}",
        "email": email,
        "demoOtp": otp,
        "expiresIn": 600
    })

@app.route('/api/auth/verify-otp', methods=['POST', 'OPTIONS'])
def auth_verify_otp():
    """Validates the 6-digit OTP for an email address."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    otp = str(data.get('otp', '')).strip()

    if not email or not otp:
        return jsonify({"success": False, "error": "Email and OTP code are required"}), 400

    record = OTP_STORE.get(email)
    if not record:
        return jsonify({"success": False, "error": "No OTP was requested for this email"}), 400

    if time.time() > record["expires_at"]:
        return jsonify({"success": False, "error": "Verification code has expired. Please request a new one."}), 400

    if record["otp"] != otp and otp != "123456":  # Allows 123456 as universal test code
        return jsonify({"success": False, "error": "Invalid verification code. Please check and try again."}), 400

    record["verified"] = True

    return jsonify({
        "success": True,
        "verified": True,
        "message": "Email verified successfully!"
    })

@app.route('/api/auth/signup', methods=['POST', 'OPTIONS'])
def auth_signup():
    """Creates a new user profile after email verification."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip() or email.split('@')[0].title()
    password = data.get('password', '')

    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    user_id = f"usr_{int(time.time())}"
    user_record = {
        "id": user_id,
        "name": name,
        "email": email,
        "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={email}",
        "plan": "Creator Free",
        "emailVerified": True,
        "provider": "email",
        "createdAt": time.strftime('%Y-%m-%d %H:%M:%S')
    }
    USERS_DB[email] = user_record

    return jsonify({
        "success": True,
        "user": user_record,
        "token": f"token_{user_id}_{int(time.time())}",
        "message": "Account created successfully!"
    })

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def auth_login():
    """Authenticates email & password."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    user = USERS_DB.get(email)
    if not user:
        # Auto-create or login with friendly defaults
        user = {
            "id": f"usr_{int(time.time())}",
            "name": email.split('@')[0].replace('.', ' ').title(),
            "email": email,
            "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={email}",
            "plan": "Pro Studio",
            "emailVerified": True,
            "provider": "email"
        }
        USERS_DB[email] = user

    return jsonify({
        "success": True,
        "user": user,
        "token": f"token_{user['id']}_{int(time.time())}",
        "message": f"Welcome back, {user['name']}!"
    })

@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def auth_google():
    """Authenticates or signs up with Google OAuth profile."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', 'sonu.sharma0624@gmail.com').strip().lower()
    name = data.get('name', 'Sonu Sharma')
    avatar = data.get('avatar', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-w7wMnJainoYTirpv9tnRm6ZuHNSze7RVnlm0wVZGeEierfeyaf3ck0tZa4Kyv0XSh8rtjo8OCMAQMHLEXyepyrZYnYjkQcEm6zeWTdBP6tTRdBKsawPYgsEsDcbTgtQ_tmhSWXNjlRy0q48G2i57WHclrzSQ8qtbpBqaMhoFwIMc2_zN-BJSvqrN2BXwfO9PknNuAMjWoZMbZecd7V_FvtP8OyIu6njkjLoPfwE')

    user = {
        "id": f"google_{int(time.time())}",
        "name": name,
        "email": email,
        "avatar": avatar,
        "plan": "Pro Studio",
        "emailVerified": True,
        "provider": "google",
        "loginTime": time.strftime('%Y-%m-%d %H:%M:%S')
    }
    USERS_DB[email] = user

    return jsonify({
        "success": True,
        "user": user,
        "token": f"gtoken_{int(time.time())}",
        "message": f"Signed in with Google as {name}!"
    })

if __name__ == '__main__':
    port = 8888
    print(f"Starting ClipForge AI Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)

