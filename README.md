# 🧭 CareerPath - Skill-Based Career Roadmap & Gap Analysis Platform

CareerPath is an intelligent MERN stack web application engineered to help students, developers, and transitioning professionals identify skill gaps, generate structured 7-level interactive career roadmaps, validate practical competencies through timed MCQ assessments, and discover matched tech job opportunities.

---

## 🌟 Key Features

- **🧭 11+ Specialized Tech Tracks**: Curated career tracks (MERN Stack, Full Stack, Data Science & AI, DevOps & Cloud, CyberSec, etc.) complete with salary trends and duration estimates.
- **🗺️ Interactive 7-Level Roadmaps**: Step-by-step milestone progression with progress tracking, curated official resources, and real-time backend synchronization.
- **📊 AI Skill Gap & Readiness Analysis**: Visual role-readiness calculation comparing acquired skills with market expectations.
- **📝 Timed MCQ Skill Assessments**: Skill verification quizzes with countdown timers, immediate explanations, and automated profile certification upon scoring $\ge 70\%$.
- **💼 Smart Job Board & Match Scoring**: Personalized job match percentage scoring and 1-click application pipeline tracking.
- **🛡️ Admin Command Center**: System-wide analytics, job posting manager, and applicant recruitment pipeline review.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Design System**: Modern Deep Slate & Glassmorphism Theme (Vanilla CSS)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **CORS & Security**: Configured CORS with origin verification

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file from .env.example
npm run seed  # Populates careers, skills, quizzes, jobs, and demo users
npm run dev   # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev   # Runs on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@careerpath.com` | `Student@123456` |
| **Admin** | `admin@careerpath.com` | `Admin@123456` |

---

## 📄 License
This project is licensed under the MIT License.
