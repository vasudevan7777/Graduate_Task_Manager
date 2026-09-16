# Graduate Task Manager

## Overview
A simple task management application developed for the Graduate Support Engineer Trainee assessment.

## Features
- Google Authentication
- Create tasks
- View tasks
- Update task status
- Firestore persistence
- User-specific task security
- Task progress summary

## Tech Stack
React, Vite, Tailwind CSS, Firebase Authentication, Firebase Firestore

## Task Statuses
Planned
In Progress
Complete

## How to Use
1. Sign in using Google.
2. Enter a task.
3. Click Add Task.
4. New tasks start as Planned.
5. Change status using the dropdown.

## Local Setup
```bash
npm install
npm run dev
```

Note: Firebase environment variables are required in `.env.local` (see `.env.example`).

## Security
Firestore rules restrict users to their own tasks (`request.auth != null && resource.data.userId == request.auth.uid`).

## Assumptions
Each authenticated user manages their own tasks.
New tasks start as Planned.

## Limitations
No task deletion, title editing, due dates, priorities, notifications, or collaboration.

## Deployment
Live Application URL: TO BE ADDED
GitHub Repository: TO BE ADDED

## AI Usage Summary
AI Tools:
- Antigravity IDE
- Claude

Usage:
- Project setup
- React implementation
- Firebase integration
- Firestore implementation
- Debugging
- UI improvements
- Documentation

Manual review:
AI-generated code was reviewed, tested, and corrected manually where required.
