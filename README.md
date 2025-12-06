# 🌴 Digital Detox Travel Planner

A full-stack web application designed to help users plan and track digital detox trips. The platform allows users to securely log in, create and manage trips, track emotional well-being through check-ins, define device usage rules, plan detailed itineraries, and leave reviews about their experiences.

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login
- Password hashing with bcrypt
- JWT-based token authentication
- Profile management (view and update user information)

### 🗺️ Trip Management
- Create, view, update, and delete trips
- Set trip destinations, dates, and descriptions
- Track trip status (planned, ongoing, completed, cancelled)
- Upload custom cover images for trips

### 💭 Emotional Check-ins
- Track mood throughout your trip (happy, relaxed, energetic, peaceful, stressed, anxious, neutral)
- Monitor stress levels (1-10 scale)
- Log daily screen time
- Add personal notes about your feelings

### 📅 Trip Itineraries
- Plan daily activities for each trip
- Set specific times and locations
- Mark activities as completed
- Organize activities by day

### 🛡️ Device Usage Rules
- Define digital detox boundaries
- Multiple rule types: Device-Free Zones, Time Limits, App Restrictions, Emergency Only, Custom
- Toggle rules active/inactive
- Track rule compliance

### ⭐ Reviews & Feedback
- Leave detailed reviews after trips
- Rate experiences (1-5 stars)
- Indicate detox success status
- Share experiences with personal notes

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd "digital detox"
```

### 2. Install Dependencies

```bash
# Install root dependencies (concurrently for running both servers)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE digital_detox_db;

# Exit psql
\q
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=digital_detox_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` to a strong, unique secret key in production!

### 5. Start the Application

#### Option A: Run Both Servers Simultaneously

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

#### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📊 Database Schema

The application uses the following database structure:

### Users
- `userID` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `passwordHash`
- `fullName`
- `bio`
- `profilePicture`
- `createdAt`

### Trips
- `tripID` (Primary Key)
- `userID` (Foreign Key → Users)
- `destination`
- `startDate`
- `endDate`
- `description`
- `status` (planned, ongoing, completed, cancelled)
- `coverImage`
- `createdAt`

### Checkins
- `checkinID` (Primary Key)
- `tripID` (Foreign Key → Trips)
- `checkinDate`
- `mood` (happy, relaxed, energetic, peaceful, stressed, anxious, neutral)
- `stressLevel` (1-10)
- `screenTime` (minutes)
- `notes`

### Itineraries
- `itineraryID` (Primary Key)
- `tripID` (Foreign Key → Trips)
- `day`
- `activity`
- `time`
- `location`
- `description`
- `isCompleted`

### Rules
- `ruleID` (Primary Key)
- `tripID` (Foreign Key → Trips)
- `ruleName`
- `description`
- `ruleType` (device_free_zones, time_limits, app_restrictions, emergency_only, custom)
- `isActive`
- `createdAt`

### Reviews
- `reviewID` (Primary Key)
- `tripID` (Foreign Key → Trips)
- `userID` (Foreign Key → Users)
- `rating` (1-5)
- `reviewText`
- `detoxSuccess` (Boolean)
- `createdAt`

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update user profile (Protected)

### Trips (`/api/trips`)
- `GET /` - Get all trips for user (Protected)
- `GET /:id` - Get single trip (Protected)
- `POST /` - Create new trip (Protected)
- `PUT /:id` - Update trip (Protected)
- `DELETE /:id` - Delete trip (Protected)

### Check-ins (`/api/checkins`)
- `GET /trip/:tripId` - Get all check-ins for trip (Protected)
- `POST /` - Create check-in (Protected)
- `PUT /:id` - Update check-in (Protected)
- `DELETE /:id` - Delete check-in (Protected)

### Itineraries (`/api/itineraries`)
- `GET /trip/:tripId` - Get all itineraries for trip (Protected)
- `POST /` - Create itinerary item (Protected)
- `PUT /:id` - Update itinerary item (Protected)
- `DELETE /:id` - Delete itinerary item (Protected)

### Rules (`/api/rules`)
- `GET /trip/:tripId` - Get all rules for trip (Protected)
- `POST /` - Create rule (Protected)
- `PUT /:id` - Update rule (Protected)
- `DELETE /:id` - Delete rule (Protected)

### Reviews (`/api/reviews`)
- `GET /trip/:tripId` - Get all reviews for trip (Protected)
- `POST /` - Create review (Protected)
- `PUT /:id` - Update review (Protected)
- `DELETE /:id` - Delete review (Protected)

## 🎨 Features Walkthrough

### 1. Register & Login
- Create an account with username, email, and password
- Login securely with JWT authentication
- Access protected routes after authentication

### 2. Dashboard
- View all your trips at a glance
- See statistics (total, ongoing, completed trips)
- Create new trips with the "New Trip" button
- Click on any trip to view details

### 3. Trip Details
- View comprehensive trip information
- Switch between Overview, Check-ins, Itinerary, Rules, and Reviews tabs
- Edit trip details (destination, description, status)
- Delete trips if needed

### 4. Check-ins Tab
- Log your emotional state throughout the trip
- Track mood, stress levels, and screen time
- Add personal notes about your experience
- View check-in history

### 5. Itinerary Tab
- Plan activities for each day of your trip
- Set specific times and locations
- Mark activities as completed
- Organize by day for easy navigation

### 6. Rules Tab
- Define your digital detox boundaries
- Choose from preset rule types or create custom ones
- Toggle rules active/inactive
- Track your commitment to device restrictions

### 7. Reviews Tab
- Share your trip experience
- Rate your trip (1-5 stars)
- Indicate if your detox was successful
- Leave detailed feedback

### 8. Profile
- View and edit your profile information
- Update full name and bio
- See account statistics

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Backend validates JWT tokens on all protected endpoints
- **Input Validation**: Server-side validation using express-validator
- **SQL Injection Protection**: Sequelize ORM with parameterized queries
- **CORS Configuration**: Controlled cross-origin resource sharing

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list  # macOS

# Verify database exists
psql -U postgres -l
```

### Port Already in Use
```bash
# Backend (Port 5000)
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000    # Windows

# Frontend (Port 3000)
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

### Cannot Connect to Backend
- Ensure backend server is running on port 5000
- Check `.env` file configuration
- Verify PostgreSQL is running and accessible

### Module Not Found Errors
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/` directory.

## 🚢 Deployment

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Create new PostgreSQL database
3. Deploy backend repository
4. Set environment variables
5. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable for API URL
6. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for digital wellness enthusiasts

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Authentication patterns inspired by JWT best practices
- UI design inspired by modern web applications

---

**Happy Digital Detoxing! 🌴📵**

















