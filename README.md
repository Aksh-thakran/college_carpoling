# College Carpooling App

A web application for college students to share rides safely and conveniently.

## 🚀 Deployment to Render

### Step 1: Prepare Your Code
Your app is already configured for Render deployment! The following files have been set up:
- `requirements.txt` - All Python dependencies
- `render.yaml` - Render deployment configuration
- `start.sh` - Startup script for production
- `app.py` - Updated for production environment

### Step 2: Deploy to Render

1. **Go to Render.com** and sign up/login
2. **Click "New"** → **"Web Service"**
3. **Connect your GitHub repository** (or upload files manually)
4. **Configure the service:**
   - **Name:** `college-carpooling` (or your choice)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `bash start.sh`

### Step 3: Environment Variables
Render will automatically set:
- `PORT` - The port your app should listen on
- `SECRET_KEY` - Auto-generated secure key

If you want data to persist across deployments, add a PostgreSQL database in Render and set:
- `DATABASE_URL` - connection string for your PostgreSQL database

### Step 4: Deploy
Click **"Create Web Service"** and wait for deployment to complete.

### Step 5: Access Your App
Once deployed, you'll get a URL like: `https://college-carpooling.onrender.com`

## 🖥️ Local Development

### Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

### Access Locally
- **Local:** `http://localhost:5000`
- **Network:** `http://YOUR_IP:5000` (for phone testing)

## 📱 Features

- ✅ User registration and login
- ✅ Offer and book rides
- ✅ Interactive map for location selection
- ✅ Real-time ride search
- ✅ Admin dashboard
- ✅ Mobile-responsive design
- ✅ Live server deployment

## 🛠️ Tech Stack

- **Backend:** Flask + SQLAlchemy
- **Frontend:** HTML/CSS/JavaScript + Leaflet Maps
- **Database:** SQLite for local development; PostgreSQL recommended for production
- **Deployment:** Render
- **Authentication:** Flask-Login

## 🔧 File Structure

```
college-carpooling/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── render.yaml           # Render deployment config
├── start.sh              # Production startup script
├── templates/            # HTML templates
│   ├── dashboard.html
│   ├── rides.html
│   └── ...
├── static/               # CSS, JS, images
│   ├── styles.css
│   ├── script.js
│   └── ...
└── README.md            # This file
```

## 🌐 Production Notes

- SQLite database persists between deployments
- Static files are served efficiently
- Automatic HTTPS certificate
- Global CDN for fast loading
- Free tier available (750 hours/month)

## 🆘 Troubleshooting

**App not loading?**
- Check Render logs for errors
- Verify all files are uploaded
- Ensure requirements.txt has all dependencies

**Database issues?**
- The database is created automatically on first run
- Data persists between deployments

**Map not working?**
- Maps use OpenStreetMap (free, no API key needed)
- Should work worldwide

---

**Ready to deploy?** Push your code to GitHub and follow the Render deployment steps above! 🚀