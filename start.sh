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

# Start the application with Gunicorn
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 30 app:app