# Complete Setup Guide for KLH Peer Learning Platform

## Step-by-Step Installation Guide

### Step 1: System Requirements
- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **MongoDB Atlas Account**: Free tier ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git**: For version control ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Step 2: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign In" or "Start Free"
3. Create a new project (e.g., "KLH-Peer-Learning")
4. Click "Build a Database"
5. Choose "FREE" tier (M0 Sandbox)
6. Select a cloud provider and region closest to you
7. Click "Create Cluster"
8. **Database Access**:
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Set user privileges to "Atlas Admin"
   - Click "Add User"

9. **Network Access**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

10. **Get Connection String**:
    - Click "Database" in left sidebar
    - Click "Connect" on your cluster
    - Choose "Connect your application"
    - Copy the connection string
    - Replace `<password>` with your actual password
    - Replace `<dbname>` with `klh-peer-learning`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/klh-peer-learning?retryWrites=true&w=majority`

### Step 3: Get Gemini API Key (Optional but Recommended)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the generated API key
5. Save it securely (you'll add this to .env file)

### Step 4: Clone and Install

```bash
# Clone the repository
git clone https://github.com/thatperplextion/peerhub.git
cd peerhub

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 5: Configure Backend Environment

Create a file named `.env` in the `backend` folder:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/klh-peer-learning?retryWrites=true&w=majority

# JWT Secret (Generate a random string)
JWT_SECRET=klh-peer-learning-super-secret-jwt-key-2024

# Server Configuration
PORT=5000
NODE_ENV=development

# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload Limits (500MB in bytes)
MAX_FILE_SIZE=524288000
```

**Important**: Replace the placeholder values with your actual credentials!

### Step 6: Configure Frontend Environment

Create a file named `.env` in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 7: Start the Application

Open TWO terminal windows:

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

You should see:
```
🎓 KLH Peer Learning Backend running on port 5000
✅ SUCCESS: Connected to MongoDB Atlas!
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser should automatically open to `http://localhost:3000`

### Step 8: Create Your First User

1. Click "Register" or "Sign Up"
2. Fill in the form:
   - University ID: (e.g., 210040330001)
   - Email: (your email@kluniversity.in)
   - Password: (at least 6 characters)
   - Name: Your full name
   - Role: Student or Faculty
   - Department: (e.g., CSE, ECE, etc.)
   - Year: (1st, 2nd, 3rd, 4th)

3. Click "Register"
4. You'll be automatically logged in!

### Step 9: Upload Your First Video

1. Click "Upload Video" button
2. Fill in details:
   - **Title**: "Introduction to Data Structures"
   - **Description**: Brief description
   - **Subject**: Computer Science
   - **Topic**: Data Structures
   - **Course Code**: CS201
   - **Semester**: 3rd Semester
   - **Tags**: arrays, linked lists, stacks (comma-separated)
   - **Video File**: Select your video file (max 500MB)

3. Click "Upload"
4. Video will be processed in background

## Troubleshooting Common Issues

### Issue 1: MongoDB Connection Failed
**Error**: `❌ FAILED: MongoDB connection error`

**Solutions**:
- Check if MONGODB_URI is correct in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Check if cluster is running in MongoDB Atlas

### Issue 2: Cannot Upload Videos
**Error**: `Upload failed` or `File too large`

**Solutions**:
- Ensure `uploads` folder exists in backend directory
- Check file size (max 500MB)
- Verify video format is supported (mp4, webm, avi, etc.)
- Check disk space on your computer

### Issue 3: Chatbot Not Working
**Error**: `Chatbot is unavailable`

**Solutions**:
- Ensure GEMINI_API_KEY is set in backend `.env`
- Check if API key is valid
- Verify you have API credits in Google Cloud Console
- Check backend console for detailed error messages

### Issue 4: Frontend Can't Connect to Backend
**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
- Ensure backend server is running (Terminal 1)
- Check if PORT 5000 is not used by another application
- Verify REACT_APP_API_URL in frontend `.env` is correct
- Check if CORS is properly configured

### Issue 5: Videos Not Playing
**Error**: Video player shows error or black screen

**Solutions**:
- Ensure video file is uploaded successfully
- Check video format compatibility
- Clear browser cache
- Try different browser
- Check browser console for errors

## Testing the Application

### Test User Registration
```bash
# Use Postman or curl
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "universityId": "210040330001",
  "email": "student@kluniversity.in",
  "password": "password123",
  "name": "Test Student",
  "role": "student",
  "department": "CSE",
  "year": "3rd"
}
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "KLH Peer Learning Backend is running!",
  "database": "Connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Production Deployment

### Deploy on Render.com (Free Hosting)

#### Backend Deployment

1. **Prepare for Deployment**
   - Push code to GitHub
   - Ensure all secrets are in environment variables (not in code)

2. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "peerhub" repository

3. **Configure Service**
   - **Name**: klh-peer-learning-backend
   - **Environment**: Node
   - **Region**: Choose closest to users
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable")
   ```
   MONGODB_URI = your-production-mongodb-uri
   JWT_SECRET = your-strong-jwt-secret
   NODE_ENV = production
   GEMINI_API_KEY = your-gemini-api-key
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```

5. **Click "Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Note the backend URL (e.g., https://klh-peer-learning.onrender.com)

#### Frontend Deployment

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository

2. **Configure Static Site**
   - **Name**: klh-peer-learning-frontend
   - **Branch**: main
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build

3. **Environment Variables**
   ```
   REACT_APP_API_URL = https://your-backend-url.onrender.com/api
   ```

4. **Click "Create Static Site"**
   - Wait for deployment
   - Your app is live!

### Important Notes for Production

1. **Security**:
   - Use strong JWT_SECRET (64+ random characters)
   - Enable HTTPS (automatic on Render)
   - Set proper CORS origins
   - Implement rate limiting

2. **MongoDB Atlas**:
   - Update network access for production IPs
   - Enable backup (recommended)
   - Monitor database usage

3. **File Storage**:
   - For production, consider using AWS S3 or Cloudinary for video storage
   - Render's storage is ephemeral (files may be deleted on restart)

4. **Performance**:
   - Enable caching
   - Optimize video compression
   - Use CDN for static assets

## Getting Help

If you encounter issues:

1. **Check Logs**:
   - Backend: Look at terminal output
   - Frontend: Check browser console (F12)

2. **Common Commands**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install

   # Check Node.js version
   node --version

   # Check MongoDB connection
   mongo "your-connection-string" --eval "db.adminCommand('ping')"
   ```

3. **Resources**:
   - [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
   - [Render Documentation](https://render.com/docs)
   - [React Documentation](https://react.dev/)
   - [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Next Steps

After successful setup:

1. ✅ Register multiple test users
2. ✅ Upload sample videos
3. ✅ Create playlists
4. ✅ Test comments and Q&A
5. ✅ Try the chatbot feature
6. ✅ Explore all platform features
7. ✅ Deploy to production

Happy learning! 🎓
