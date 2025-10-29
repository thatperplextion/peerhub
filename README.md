
# peerhub

## 🌟 Features# peerhub


### Core Features
- **Video Upload & Management**: Upload educational videos with rich metadata (subject, topic, course code, semester)
- **Playlist Creation**: Create and organize curated playlists aligned with KLH syllabus  
- **Video Streaming**: Stream videos directly within the platform (no YouTube APIs)
- **Interactive Comments**: Engage with video content through timestamped comments
- **Q&A Forums**: Dedicated question-answer sections for each video
- **User Profiles**: Track uploaded videos, created playlists, and saved content

### Bonus Features ⭐
- **AI Chatbot**: Domain-specific chatbot powered by Google Gemini API
- **Video Transcripts**: Auto-generated transcripts for uploaded videos
- **Video Summarization**: AI-powered summaries using video transcripts

## 🏗️ Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Google Generative AI (Gemini)
- Multer for file uploads

### Frontend
- React 18
- React Query
- Axios
- Lucide React icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Google Gemini API key (optional)

### Installation

1. **Clone & Install**
```bash
git clone https://github.com/thatperplextion/peerhub.git
cd peerhub
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Run Application**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm start
```

Visit `http://localhost:3000`

## 📱 Key Features

- ✅ User authentication (Students, Faculty, Admin)
- ✅ Video upload with metadata tagging
- ✅ Direct video streaming
- ✅ Playlist management
- ✅ Interactive comments system
- ✅ Q&A forums
- ✅ AI-powered chatbot
- ✅ Video transcripts & summaries
- ✅ Advanced search & filters

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Videos
- `GET /api/videos`
- `POST /api/videos/upload`
- `GET /api/videos/:id`

### Comments & Q&A
- `GET /api/comments/video/:videoId`
- `POST /api/qa`

### Chatbot
- `POST /api/chatbot/ask`

## 🚀 Deployment on Render

1. Push code to GitHub
2. Create Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy!

## 📄 License

MIT License

---

**Built for KLH University Community** 🎓


