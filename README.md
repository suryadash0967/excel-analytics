# 📊 Excel Analytics

Excel Analytics is a **full-stack web application** that allows users to upload Excel files, visualize data in **2D and 3D charts**, and receive **AI-generated insights** — all directly in the browser.

---

## 🚀 Live Demo
🔗 [Excel Analytics](https://excel-analytics-virid.vercel.app/)

---

## ✨ Features
- ✅ **User/Admin Authentication** (JWT-based)
- ✅ **Excel Upload & Parsing** (.xls / .xlsx) using **Multer + SheetJS**
- ✅ **Interactive Charts**
  - 2D: Bar, Line, Pie (via Chart.js)
  - 3D: Bar, Scatter (via Three.js)
- ✅ **AI Insights (Gemini Flash)**
  - Detects patterns, outliers, and trends
  - Generates **business-ready recommendations**
- ✅ **Dashboard**
  - File history & chart management
- ✅ **Export Options**
  - Download charts as **PNG/PDF**
- ✅ **Dark Mode** Support
- ✅ **Admin Panel**
  - Monitor usage and manage users

---

## 🛠 Tech Stack
- **Frontend:** React.js (with Dark Mode)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Libraries:** SheetJS, Chart.js, Three.js, Multer, JWT
- **AI Layer:** Gemini Flash
- **Deployment:** Vercel (Frontend) + Render (Backend)

---

## 📸 Screenshots
> *(Add screenshots of your dashboard, chart views, and AI insights here.)*

---

## 🧑‍💻 Installation & Setup

### 1. Clone the Repository

git clone https://github.com/<your-username>/excel-analytics.git
cd excel-analytics

### Backend Setup
cd backend
npm install
node server.js

### Frontend Setup
cd frontend
npm install
npm run dev

## 📈 What I Learned
- Building secure auth flows (User/Admin)
- Handling Excel file parsing in Node.js
- Rendering dynamic 2D/3D charts
- AI integration for data summarization
- Full-stack deployment with Vercel + Render
