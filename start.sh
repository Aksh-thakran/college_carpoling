#!/bin/bash
# Startup script for Render deployment

# Set environment variables
export FLASK_ENV=production
export PYTHONUNBUFFERED=1

echo "🚀 Starting College Carpooling deployment..."

# Create database if it doesn't exist
echo "📊 Initializing database..."
python -c "
try:
    from app import app, db
    with app.app_context():
        db.create_all()
        print('✅ Database initialized successfully')
except Exception as e:
    print(f'❌ Database initialization failed: {e}')
    exit(1)
"

# Check if PORT is set
if [ -z "$PORT" ]; then
    echo "❌ PORT environment variable not set, using default 5000"
    PORT=5000
fi

echo "🌐 Starting server on port $PORT..."

# Try to use Gunicorn, fall back to Flask if not available
if python -c "import gunicorn" 2>/dev/null; then
    echo "🐍 Using Gunicorn server..."
    exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 30 app:app
else
    echo "🐍 Gunicorn not available, using Flask development server..."
    exec python -c "
from app import app
import os
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
"
fi