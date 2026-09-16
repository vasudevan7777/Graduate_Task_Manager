# Graduate Task Manager

A minimal, secure, and responsive Task Management Application developed for the **Graduate Support Engineer Trainee assessment** using React, Vite, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

---

## 🚀 Features

- **Google Authentication**: Single-click authentication using Firebase Auth with Google OAuth Provider.
- **Create Tasks**: Add new tasks instantly with 0ms local latency compensation (initial status defaulted to `Planned`).
- **View User Tasks**: Real-time Firestore query (`onSnapshot`) filtered strictly to the logged-in user's UID (`userId == uid`).
- **Update Task Status**: Update task status seamlessly between **Planned**, **In Progress**, and **Complete**.
- **Task Summary & Progress Bar**: Real-time task metrics (Total, Planned, In Progress, Complete) and completion percentage indicator.
- **Strict Data Security**: Security rules enforce private user data isolation at the Firestore database level.

---

## 🛠 Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Authentication (Google OAuth Provider)
- **Database**: Firebase Cloud Firestore
- **Data Sync**: Real-time `onSnapshot` listeners

---

## 📋 Data Model

Each task document stored in the `tasks` Cloud Firestore collection:

```json
{
  "id": "auto-generated-firestore-id",
  "title": "Task title string",
  "status": "Planned | In Progress | Complete",
  "userId": "authenticated-user-uid",
  "createdAt": "Firestore serverTimestamp()",
  "updatedAt": "Firestore serverTimestamp()"
}
```

---

## 📁 Project Structure

```
Graduate_Task_Manager/
├── src/
│   ├── firebase.js             # Firebase initialization, Auth, & Firestore setup
│   ├── App.jsx                 # Main layout & auth state container
│   ├── index.css               # Tailwind CSS imports
│   ├── main.jsx                # React entry point
│   └── components/
│       ├── Login.jsx           # Google sign-in screen
│       ├── AddTaskForm.jsx     # Task creation form
│       ├── TaskList.jsx        # Task list, summary metrics & progress bar
│       └── TaskItem.jsx        # Task item card & status dropdown
├── firestore.rules             # Firestore security rules
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore configuration (.env.local protected)
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration with @tailwindcss/vite
└── package.json                # Project dependencies
```

---

## 💻 Local Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Data Isolation

Firestore security rules in [`firestore.rules`](file:///e:/DOWNLOADS/Graduate_Task_Manager/firestore.rules) restrict all read, create, update, and delete access strictly to the authenticated task owner:

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 💡 Assumptions & Limitations

### Assumptions
- Tasks are private to the authenticated user.
- New tasks default to status `Planned`.
- Task title input is trimmed and validated against empty strings.

### Limitations (Out of Scope by Assessment Requirements)
- No task deletion or title editing.
- No due dates, priorities, tags, or categories.
- No dark mode, search, filtering, or sorting controls.
- No external backend servers or extra state management packages.

---

## 🤖 AI Usage Summary

- **AI Tools**: Antigravity IDE, Claude
- **Usage**: Project setup, React component scaffolding, Firebase Auth/Firestore integration, error diagnosis, UI styling, and documentation.
- **Manual Review**: All AI-assisted code was manually inspected, tested, verified, and tuned for performance and compliance with assessment requirements.
