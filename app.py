from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Database configuration
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Use PostgreSQL in production (Render provides this)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Use SQLite for local development
    db_path = os.path.join(os.getcwd(), 'users.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Production settings
if os.environ.get('FLASK_ENV') == 'production':
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
else:
    app.config['DEBUG'] = True

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Ride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    from_location = db.Column(db.String(50), nullable=False)
    to_location = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    vehicle_type = db.Column(db.String(20), nullable=False, default='4-wheeler')
    contact = db.Column(db.String(200), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@login_required
def index():
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        identifier = request.form.get('email')  # This field now accepts email or username
        password = request.form.get('password')
        user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('index'))
        else:
            flash('Invalid email/username or password')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('signup'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists')
            return redirect(url_for('signup'))
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Account created successfully! Please log in.')
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/admin')
@login_required
def admin():
    users = User.query.all()
    return render_template('admin.html', users=users)

@app.route('/delete_user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # Delete all rides offered by this user first
    Ride.query.filter_by(driver_id=user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully')
    return redirect(url_for('admin'))

@app.route('/offer_ride', methods=['POST'])
@login_required
def offer_ride():
    from_location = request.form.get('from')
    to_location = request.form.get('to')
    date = request.form.get('date')
    time = request.form.get('time')
    seats = int(request.form.get('seats'))
    vehicle_type = request.form.get('vehicle_type')
    contact = request.form.get('contact')
    notes = request.form.get('notes')
    
    new_ride = Ride(
        driver_id=current_user.id,
        from_location=from_location,
        to_location=to_location,
        date=date,
        time=time,
        seats=seats,
        vehicle_type=vehicle_type,
        contact=contact,
        notes=notes
    )
    db.session.add(new_ride)
    db.session.commit()
    
    return {'success': True, 'message': 'Ride offered successfully!'}

@app.route('/get_rides', methods=['GET'])
@login_required
def get_rides():
    from_location = request.args.get('from')
    to_location = request.args.get('to')
    date = request.args.get('date')
    vehicle_type = request.args.get('vehicle_type')
    
    query = Ride.query
    if from_location:
        query = query.filter_by(from_location=from_location)
    if to_location:
        query = query.filter_by(to_location=to_location)
    if date:
        query = query.filter_by(date=date)
    if vehicle_type and vehicle_type != '':
        query = query.filter_by(vehicle_type=vehicle_type)
    
    rides = query.all()
    rides_data = []
    for ride in rides:
        driver = User.query.get(ride.driver_id)
        rides_data.append({
            'id': ride.id,
            'driver': driver.username,
            'from': ride.from_location,
            'to': ride.to_location,
            'date': ride.date,
            'time': ride.time,
            'seats': ride.seats,
            'vehicle_type': ride.vehicle_type,
            'contact': ride.contact,
            'notes': ride.notes
        })
    
    return {'rides': rides_data}

@app.route('/rides')
@login_required
def rides():
    rides = Ride.query.all()
    rides_data = []
    for ride in rides:
        driver = User.query.get(ride.driver_id)
        rides_data.append({
            'id': ride.id,
            'driver': driver.username,
            'from': ride.from_location,
            'to': ride.to_location,
            'date': ride.date,
            'time': ride.time,
            'seats': ride.seats,
            'vehicle_type': ride.vehicle_type,
            'contact': ride.contact,
            'notes': ride.notes,
            'created_at': ride.created_at
        })
    return render_template('rides.html', rides=rides_data)

@app.route('/health')
def health():
    return {'status': 'healthy', 'message': 'College Carpooling API is running'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5000))

    if os.environ.get('FLASK_ENV') == 'production':
        print("🚀 Starting College Carpooling Server (Production)...")
        app.run(host='0.0.0.0', port=port)
    else:
        print("🚀 Starting College Carpooling Server (Development)...")
        print("📱 Access from your phone using your computer's IP address")
        print("💻 Local access: http://localhost:5000")
        app.run(host='0.0.0.0', port=port, debug=True)