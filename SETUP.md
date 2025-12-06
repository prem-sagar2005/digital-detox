# 🚀 Quick Setup Guide

This guide will help you get the Digital Detox Travel Planner up and running in minutes.

## Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] PostgreSQL (v12+) installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Database Setup

**Windows (PowerShell):**
```powershell
# Start PostgreSQL service
net start postgresql-x64-14

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE digital_detox_db;
\q
```

**macOS:**
```bash
# Start PostgreSQL
brew services start postgresql

# Create database
createdb digital_detox_db
```

**Linux:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb digital_detox_db
```

### 2. Backend Configuration

```bash
cd backend

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# (Use notepad, nano, vim, or your preferred editor)
```

**Edit `.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=digital_detox_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
JWT_SECRET=change_this_to_a_random_secret_key_in_production
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# From project root
npm run install-all
```

Or manually:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 4. Start Development Servers

```bash
# From project root - starts both backend and frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

### 5. First Time Use

1. Open http://localhost:3000 in your browser
2. Click "Sign up" to create a new account
3. Fill in your details:
   - Username (minimum 3 characters)
   - Email (valid email address)
   - Password (minimum 6 characters)
4. Click "Sign Up" - you'll be automatically logged in
5. Start creating your first digital detox trip!

## Common Issues & Solutions

### Issue: Database Connection Failed

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows
sc query postgresql-x64-14

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l | grep digital_detox_db
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Change PORT in backend/.env to a different port (e.g., 5001)
# Update API proxy in frontend/vite.config.js to match
```

### Issue: Module Not Found

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Issue: Cannot Login After Registration

**Solution:**
- Check browser console for errors
- Verify backend is running (http://localhost:5000/api/health should return OK)
- Check backend console for error messages

## Testing the Setup

### Test Backend API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Response:** `{"status":"OK","message":"Digital Detox API is running"}`

### Test Database Connection

The backend will automatically:
1. Connect to the database on startup
2. Create all tables if they don't exist
3. Display success messages in the console

Look for these messages:
```
✓ Database connection established successfully
✓ Database synchronized
✓ Server running on port 5000
```

## Development Tips

### Running Backend Only
```bash
cd backend
npm run dev
```

### Running Frontend Only
```bash
cd frontend
npm run dev
```

### View Backend Logs
The backend console will show:
- API requests
- Database queries (in development mode)
- Errors and warnings

### View Frontend Logs
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

## Next Steps

1. ✅ Create your first trip
2. ✅ Add some activities to your itinerary
3. ✅ Set device usage rules
4. ✅ Log your first emotional check-in
5. ✅ Leave a review after your trip

## Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in README.md
- Check database schema in backend/database-schema.sql

## Production Deployment

For production deployment instructions, see the "Deployment" section in README.md.

---

**Happy Coding! 🚀**

















