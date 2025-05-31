
<h1 align="center">TodoApp AI</h1>

<p align="center">
An AI-powered task management app with a chatbot interface.<br>
Built with React, Node.js, LangGraph, and SQLite. AI powered by Gemini.<br>
</p>
<p align="center">🚀 Currently in version V0.1</p>

---

## 🧠 About the Project

TodoApp AI is a task manager where you interact with an AI agent to manage your reminders.  
The chatbot communicates with a backend API and a database to create, update, list, and delete reminders.

The AI agent (built with LangGraph and Gemini) has tools to interact with the backend endpoints and handle database operations — making it capable of functioning as an autonomous task assistant.

---

## 🧰 Tools & Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js + Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Python + LangGraph](https://langgraph.org/)
- [Gemini API](https://aistudio.google.com/app/prompts/new_chat)

---

## ⚙️ How to Run

### 🔑 Requirements:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Gemini API Key

### 🔧 Environment Variables:
Create a `.env` file in the `ai-service` folder with the following:

```
GEMINI_API_KEY=your_key_here
```

---

### 🚀 Running the Project:

```bash
docker-compose up --build
```

This will start:
- Frontend on: `http://localhost:5173`
- Backend API on: `http://localhost:3000`
- AI Service on: `http://localhost:8000`
  
---

## 📦 Project Structure

```
.
├── ai-service         # LangGraph AI agent with Gemini
├── backend            # Node.js + Express + SQLite API
├── frontend           # React + Vite + Tailwind chat interface
└── docker-compose.yml # Orchestration
```

---

## 🤖 Features

- ✍️ Create, list, update, and delete reminders
- 💬 Chat interface powered by Gemini AI
- 🧠 AI agent with LangGraph, capable of handling tasks autonomously
- 🔗 Full integration between AI, backend API, and database

---

## ✍️ Author

Made with 🔥 by Johan Stromberg

[![Instagram Badge](https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/_johanrecaman_)

---

## 💡 Future Improvements

- ✅ Authentication
- ✅ More AI capabilities
- ✅ Improve UX/UI
- ✅ Switch to a more robust database (PostgreSQL or MongoDB)
- ✅ Deploy to the cloud
