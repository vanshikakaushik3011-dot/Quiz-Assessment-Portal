# 🎓 Quiz & Assessment Portal

A modern, responsive, production-ready Full-Stack Academic Quiz and Assessment Web Application built for students and educators using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS and JWT Authentication.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Pre-Seeded Demo Credentials](#-pre-seeded-demo-credentials)
- [Getting Started & Installation](#-getting-started--installation)
  - [Opening in VS Code](#1-opening-in-vs-code)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
- [Running the Application](#-running-the-application)
- [Database Configuration](#-database-configuration)
- [REST API Endpoints](#-rest-api-endpoints)
- [Testing with Postman](#-testing-with-postman)
- [Security Features](#-security-features)
- [Future Enhancements](#-future-enhancements)

---

## 🌟 Overview

The **Quiz & Assessment Portal** bridges classroom instruction with rigorous digital assessment. It provides an intuitive examination environment for students and a comprehensive curriculum management and analytics suite for faculty members.

### Highlights
- **100% Zero-Setup Execution**: Automatically connects to your local MongoDB service, MongoDB Atlas URI, or gracefully falls back to an embedded in-memory MongoDB engine with pre-seeded demo accounts and curriculum quizzes!
- **Server-Side Scoring Integrity**: Correct answers are securely withheld from students during tests and scores are strictly calculated on the server to prevent tamper attempts.
- **Auto-Submission**: Integrated countdown timer automatically submits and evaluates tests the instant time runs out.

---

## 🚀 Key Features

### 1. Landing Page
- Modern EdTech responsive interface.
- Hero section with clear call-to-actions (`Get Started`, `Sign In`).
- Features breakdown showcasing online quizzes, instant evaluations, and teacher controls.
- Interactive curriculum preview cards.
- Quick 1-Click demo accounts banner for immediate viva and grading demonstrations.

### 2. Authentication & Authorization
- Robust email/password registration with role selection (**Student** or **Teacher**).
- Passwords hashed with **bcryptjs** (salt factor 10).
- Stateless **JSON Web Tokens (JWT)** for session validation.
- Role-based route protection preventing unauthorized access.
- Error alerts for invalid emails, duplicate accounts, and missing fields.

### 3. Student Experience
- **Student Dashboard**: Welcome banner, KPIs (quizzes taken, average score, highest score, pass percentage), and recent submissions list.
- **Available Quizzes**: Search and filter assessments by discipline, view question counts, duration, and total marks.
- **Interactive Quiz Interface**:
  - Live countdown timer with warning animations under 2 minutes.
  - Automatic submission when the clock reaches zero.
  - Single-choice MCQ selection with clear visual feedback.
  - Clickable question palette to jump directly to any question.
  - Answer counter and pre-submission confirmation dialog.
- **Instant Result Evaluation**:
  - Immediate pass/fail verdict badge.
  - Metric summary: total questions, correct, wrong, skipped, score, percentage, and time spent.
  - Question-by-question review showing student's choice vs correct answer key.
  - "Retake Quiz" and "Back to Dashboard" shortcuts.
- **Performance History (My Results)**: Tabular history of previous attempts with quick detail inspection.

### 4. Teacher & Faculty Suite
- **Teacher Dashboard**: Aggregate metrics (quizzes created, registered students, total submissions, average score, and pass rate).
- **Create Quiz Builder**:
  - Configure title, subject, duration, and passing percentage threshold.
  - Dynamically add/remove questions.
  - Set 4 options (A, B, C, D) per question, click to select the correct answer key, and assign custom marks.
- **Manage Quizzes**:
  - View all curriculum quizzes.
  - Full CRUD functionality: Create, Read/Inspect preview, Update, and Delete with confirmation modal.
- **Student Submissions Table**:
  - View all student attempt records.
  - Multi-attribute filtering by student name, quiz title, subject discipline, or PASS/FAIL result.
  - Detailed submission breakdown modal showing the student's exact responses.

### 5. Profile Management
- View account information and role-specific academic statistics.
- Update display name.
- Secure password change requiring verification of current password.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM v6, Tailwind CSS, Lucide React Icons, Axios |
| **Backend** | Node.js, Express.js, RESTful Architecture, Morgan HTTP Logger, CORS |
| **Database** | MongoDB, Mongoose ODM, In-Memory Mongo Engine fallback |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |

---

## 📂 Folder Structure

```
Quiz-Assessment-Portal/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── StatCard.jsx
│       │   ├── Modal.jsx
│       │   └── Toast.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── student/
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── AvailableQuizzes.jsx
│       │   │   ├── QuizAttempt.jsx
│       │   │   ├── ResultPage.jsx
│       │   │   └── MyResults.jsx
│       │   └── teacher/
│       │       ├── TeacherDashboard.jsx
│       │       ├── CreateQuiz.jsx
│       │       ├── EditQuiz.jsx
│       │       ├── ManageQuizzes.jsx
│       │       └── StudentResults.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── quizService.js
│       │   └── attemptService.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── seedData.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── quizController.js
│   │   ├── attemptController.js
│   │   └── teacherController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── QuizAttempt.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── attemptRoutes.js
│   │   └── teacherRoutes.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔑 Pre-Seeded Demo Credentials

The database is pre-seeded with faculty, students, and sample assessments so the portal can be evaluated immediately without manual entry. You can also click the **"One-Click Demo Credentials"** buttons on the Login page!

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Teacher / Faculty** | Dr. Robert Smith | `teacher@portal.edu` | `Teacher@123` |
| **Student 1** | Alice Johnson | `student1@portal.edu` | `Student@123` |
| **Student 2** | Bob Davis | `student2@portal.edu` | `Student@123` |
| **Student 3** | Charlie Brown | `student3@portal.edu` | `Student@123` |

---

## 🚀 Getting Started & Installation

### 1. Opening in VS Code

1. Launch **Visual Studio Code**.
2. Click **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows / `Cmd+O` on macOS).
3. Select the `Quiz-Assessment-Portal` directory.
4. Open the integrated terminal in VS Code (`Ctrl+\`` or **Terminal** > **New Terminal**).

---

### 2. Install Dependencies

```bash
# Run this from the project root (Quiz-Assessment-Portal)
npm install
```

### 3. Configure the Backend

The backend configuration is in `server/.env`. Verify or customize it as needed:
```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quiz_portal
JWT_SECRET=quiz_portal_jwt_secret_key_production_grade_2025
JWT_EXPIRES_IN=7d
```

---

## 💻 Running the Application

Open two terminal tabs in the project root after running `npm install`:

1. **Terminal 1 (Backend)**:
   ```bash
   npm run dev:server
   ```
   *The backend will boot up on `http://localhost:5000` and automatically connect to MongoDB or initialize the embedded In-Memory database.*

2. **Terminal 2 (Frontend)**:
   ```bash
   npm run dev:client
   ```
   *The Vite development server will start on `http://localhost:5173`.*

To create a production frontend build from the project root, run `npm run build`.

3. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 🗄️ Database Configuration

In `server/config/db.js`, the system utilizes an intelligent dual-mode database engine:
1. **Local or Cloud MongoDB (Atlas)**:
   If a running MongoDB instance or MongoDB Atlas connection string is provided in `server/.env` under `MONGODB_URI`, the server connects to it directly.
2. **Automatic Embedded In-Memory Engine Fallback**:
   If no external MongoDB service is running, the server automatically boots an embedded in-memory MongoDB engine. This guarantees **100% zero-configuration execution** for academic demonstrations and college evaluations!
3. **Automatic Seeding**:
   On the first connection, the seeder automatically populates the demo teacher, 3 students, 3 sample quizzes across diverse disciplines, and realistic attempt records.

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student or teacher account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile |

### User Profile (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | Get profile details and role analytics |
| `PUT` | `/api/users/profile` | Private | Update name or change password |

### Quizzes (`/api/quizzes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes` | Public / Private | List all quizzes with search & filter |
| `GET` | `/api/quizzes/:id` | Public / Private | Get quiz by ID (sanitizes answers for students) |
| `POST` | `/api/quizzes` | Teacher Only | Create a new quiz assessment |
| `PUT` | `/api/quizzes/:id` | Teacher Only | Update existing quiz details/questions |
| `DELETE` | `/api/quizzes/:id` | Teacher Only | Delete quiz and associated attempts |

### Quiz Attempts & Scoring (`/api/attempts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attempts` | Student Only | Submit test responses & receive automatic evaluation |
| `GET` | `/api/attempts/my-results` | Student Only | Get history of student's past attempts & metrics |
| `GET` | `/api/attempts/:id` | Student / Teacher | Get detailed attempt breakdown with questions |

### Teacher Analytics (`/api/teacher`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/teacher/statistics` | Teacher Only | Aggregate statistics for teacher dashboard |
| `GET` | `/api/teacher/results` | Teacher Only | List all student submissions with filters |

---

## 🧪 Testing with Postman

1. **Login Request**:
   - `POST http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "student1@portal.edu",
       "password": "Student@123"
     }
     ```
   - Copy the returned `token` from the response.

2. **Authenticated Request**:
   - In subsequent requests, navigate to the **Headers** tab.
   - Add:
     - Key: `Authorization`
     - Value: `Bearer <YOUR_COPIED_TOKEN>`

3. **Submit Quiz Attempt**:
   - `POST http://localhost:5000/api/attempts`
   - Body (JSON):
     ```json
     {
       "quizId": "<QUIZ_OBJECT_ID>",
       "answers": {
         "<QUESTION_1_ID>": 1,
         "<QUESTION_2_ID>": 2
       },
       "timeSpentSeconds": 240
     }
     ```
   - Returns full evaluation: score, totalMarks, percentage, correctAnswers, wrongAnswers, and PASS/FAIL result.

---

## 🔒 Security Features

- **Password Encryption**: All passwords hashed using `bcryptjs` with salt rounds. Plaintext passwords are never saved or returned in JSON responses (`select: false`).
- **JWT Authorization**: Cryptographic signing of tokens using secret key with 7-day expiration.
- **Client Route Guards**: ProtectedRoute component actively redirects unauthenticated users or users lacking required permissions.
- **Server Tamper Prevention**: Question answer keys (`correctAnswer`) are automatically stripped from API responses sent to students. Scores are evaluated exclusively server-side.
- **CORS Protection**: Configured Cross-Origin Resource Sharing for API security.

---

## 🚀 Future Enhancements

- Multiple question types: Multiple-selection checkboxes, True/False, and subjective code snippets.
- Automated certificate generation for passed assessments.
- Proctoring integrations (tab-switch detection, webcam proctoring).
- Live multiplayer leaderboard for classroom quizzes.
- PDF download for result transcripts.

---

## 🎓 Academic Viva & Presentation Notes

- **Architecture**: Modular separation of concerns with RESTful API controllers, models, and middleware on the backend; component-based reactive state and Context API on the frontend.
- **Scalability**: Stateless JWT authentication allows the backend to scale horizontally across multiple instances.
- **Maintainability**: Clean code structure adhering to industry best practices, suitable for college project demonstrations and viva evaluations.

---

**Developed with ❤️ for Academic Assessment & Digital Learning.**
