#!/bin/bash
# Startup script for Render deployment

# Set environment variables
export FLASK_ENV=production

# Create database if it doesn't exist
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database initialized')
"

# Start the application with Gunicorn
gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 app:app