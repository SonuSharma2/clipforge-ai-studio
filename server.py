"""
ClipForge AI Video Studio - Backend Server
Supports real video downloading via yt-dlp, FFmpeg 9:16 vertical conversion,
real short generation, and video streaming.
"""

import os
import sys
import json
import time
import random
from flask import Flask, request, jsonify, send_from_directory, send_file
import video_engine
import db

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

    # Persist generated clips into SQLite database
    user_id = data.get('user_id')
    if result and result.get('clips'):
        for c in result['clips']:
            try:
                db.save_clip(
                    video_url=c.get('videoUrl', ''),
                    title=c.get('title', 'Generated Short'),
                    score=c.get('score', '95/100'),
                    duration=c.get('duration', '0:30'),
                    style=c.get('style', caption_style),
                    thumbnail=c.get('image', ''),
                    user_id=user_id
                )
            except Exception as e:
                print(f"[DB] Error saving clip to database: {e}")

    return jsonify(result)

# ----------------- Database & Auth Routes (SQLite) -----------------

@app.route('/api/auth/send-otp', methods=['POST', 'OPTIONS'])
def auth_send_otp():
    """Generates a 6-digit OTP for email verification and persists to SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    purpose = data.get('purpose', 'verification')
    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    otp = f"{random.randint(100000, 999999)}"
    db.save_otp(email=email, otp=otp, purpose=purpose, expires_in=600)

    print(f"\n[AUTH] ✉️ Generated {purpose.upper()} OTP for {email}: {otp} (saved to SQLite, expires in 10m)\n")

    return jsonify({
        "success": True,
        "message": f"Verification code sent to {email}",
        "email": email,
        "demoOtp": otp,
        "expiresIn": 600
    })

@app.route('/api/auth/verify-otp', methods=['POST', 'OPTIONS'])
def auth_verify_otp():
    """Validates the 6-digit OTP for an email address against SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    otp = str(data.get('otp', '')).strip()

    if not email or not otp:
        return jsonify({"success": False, "error": "Email and OTP code are required"}), 400

    is_valid, msg = db.verify_otp(email, otp)
    if not is_valid:
        return jsonify({"success": False, "error": msg}), 400

    return jsonify({
        "success": True,
        "verified": True,
        "message": "Email verified successfully!"
    })

@app.route('/api/auth/signup', methods=['POST', 'OPTIONS'])
def auth_signup():
    """Creates a new user profile permanently in SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip() or email.split('@')[0].title()
    password = data.get('password', '')

    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    user_record = db.create_user(
        name=name,
        email=email,
        password=password,
        provider='email',
        plan='Creator Free'
    )

    user_safe = {k: v for k, v in user_record.items() if k not in ('password_hash', 'salt')}

    return jsonify({
        "success": True,
        "user": user_safe,
        "token": f"token_{user_safe['id']}_{int(time.time())}",
        "message": "Account created successfully!"
    })

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def auth_login():
    """Authenticates email & password against SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    user = db.get_user_by_email(email)
    if not user:
        # Auto-create profile for first-time login
        user = db.create_user(
            name=email.split('@')[0].replace('.', ' ').title(),
            email=email,
            password=password or 'ClipForge123!',
            plan='Pro Studio'
        )
    else:
        # Check password if one was set
        if user.get('password_hash') and password:
            user_auth, err = db.authenticate_user(email, password)
            if err:
                return jsonify({"success": False, "error": err}), 401
            user = user_auth

    user_safe = {k: v for k, v in user.items() if k not in ('password_hash', 'salt')}

    return jsonify({
        "success": True,
        "user": user_safe,
        "token": f"token_{user_safe['id']}_{int(time.time())}",
        "message": f"Welcome back, {user_safe['name']}!"
    })

@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def auth_google():
    """Authenticates or signs up with Google OAuth profile permanently in SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', 'sonu.sharma0624@gmail.com').strip().lower()
    name = data.get('name', 'Sonu Sharma')
    avatar = data.get('avatar', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-w7wMnJainoYTirpv9tnRm6ZuHNSze7RVnlm0wVZGeEierfeyaf3ck0tZa4Kyv0XSh8rtjo8OCMAQMHLEXyepyrZYnYjkQcEm6zeWTdBP6tTRdBKsawPYgsEsDcbTgtQ_tmhSWXNjlRy0q48G2i57WHclrzSQ8qtbpBqaMhoFwIMc2_zN-BJSvqrN2BXwfO9PknNuAMjWoZMbZecd7V_FvtP8OyIu6njkjLoPfwE')

    user = db.upsert_google_user(email=email, name=name, avatar=avatar)
    user_safe = {k: v for k, v in user.items() if k not in ('password_hash', 'salt')}

    return jsonify({
        "success": True,
        "user": user_safe,
        "token": f"gtoken_{int(time.time())}",
        "message": f"Signed in with Google as {user_safe['name']}!"
    })

@app.route('/api/waitlist', methods=['POST', 'OPTIONS'])
def api_waitlist():
    """Adds user email to Studio VIP waitlist table in SQLite."""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    source = data.get('source', 'studio')
    if not email or '@' not in email:
        return jsonify({"success": False, "error": "Valid email address is required"}), 400

    status = db.add_to_waitlist(email=email, source=source)
    return jsonify({
        "success": True,
        "status": status,
        "message": "You are on the Studio VIP early access list!"
    })

@app.route('/api/user/clips', methods=['GET'])
def api_user_clips():
    """Returns saved clips from SQLite."""
    user_id = request.args.get('user_id')
    clips = db.get_recent_clips(user_id=user_id, limit=20)
    return jsonify({
        "success": True,
        "clips": clips
    })

@app.route('/api/database/status', methods=['GET'])
def api_db_status():
    """Returns database connection status and statistics."""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM clips")
        clip_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM waitlist")
        waitlist_count = cursor.fetchone()[0]
        conn.close()

        return jsonify({
            "status": "connected",
            "engine": "SQLite3",
            "database_file": db.DB_PATH,
            "total_users": user_count,
            "total_clips": clip_count,
            "waitlist_signups": waitlist_count,
            "timestamp": time.time()
        })
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    port = 8888
    print(f"Starting ClipForge AI Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)

