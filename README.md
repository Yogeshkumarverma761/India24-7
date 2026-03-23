# India247 🇮🇳

India247 is a next-generation civic platform that empowers Indian citizens to report, track, and resolve local issues (potholes, garbage, water leaks) using AI and community collaboration.

## 🚀 Key Features

*   **Meera AI Assistant**: Report issues via a smart chat or voice commands.
*   **AI Vision Verification**: Automated photo verification to ensure reporting accuracy.
*   **Live Complaint Map**: Real-time visualization of civic issues in your ward.
*   **OTP Security**: Secure citizen login via one-time passwords.
*   **Leaderboard & Rewards**: Earn points and badges for civic engagement.
*   **Officer Dashboard**: Task management for municipal offiers.

---

## 🛠️ Project Structure

```bash
India247/
├── frontend/  # React (Vite) + Tailwind CSS
└── backend/   # FastAPI + PostgreSQL (SQLModel) + Gemini AI
```

---

## 💻 Local Development

### 1. Backend Setup
1. Navigate to the `/backend` folder.
2. Create a `.env` file from the `.env.example`.
3. Fill in your **Gemini AI Keys** and **Database URL** (e.g. Neon PostgreSQL).
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

> [!TIP]
> The project is pre-configured for **Neon PostgreSQL**. For production, ensure your connection string includes `sslmode=require`.

### 2. Frontend Setup
1. Navigate to the `/frontend` folder.
2. Create a `.env` file from the `.env.example`.
3. Add your **Google Maps API Key**.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment Guide

### Backend (e.g., Render, Heroku)
1. Set the root directory to `/backend`.
2. Configure **Environment Variables** (see `backend/.env.example`).
3. Set the build command to `pip install -r requirements.txt`.
4. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend (e.g., Vercel, Netlify)
1. Set the root directory to `/frontend`.
2. Configure **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed backend API (including `/api`).
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Maps API key.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.

---

## 🇮🇳 Jai Hind!
Built for a better, cleaner, and smarter India.
