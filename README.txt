INSYD – Notification System Proof-of-Concept

Project Overview: 
-----------------
Insyd is the next-generation social web platform for the Architecture Industry. The platform connects users through blogs, chats, jobs, and other social interactions. To increase engagement, Insyd requires a real-time notification system that informs users about activity from people they follow, people following them, or users discovering their content.

This project implements a **proof-of-concept (POC)** for the notification system, designed for a **bootstrapped startup scenario with 100 daily active users (DAUs)**.

Key Features:
-------------
- Real-time notifications for user activities:
  * Posts by followed users
  * Comments or likes on user’s content
  * Content discovery by new users
- Simple front-end using ReactJS to visualize notifications
- Back-end using NodeJS to manage notifications
- Database support for storing user, content, and notification data
- Designed for **POC purposes only**; authentication, caching, and responsive UI are not implemented

Technology Stack:
-----------------
- Frontend: ReactJS
- Backend: NodeJS with ExpressJS
- Database: MongoDB
- Real-time communication: Socket.io 

Folder Structure:
------------------
insyd-notification-poc/
│
├── frontend/                  # ReactJS frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # App pages
│   │   └── App.jsx           # Main React component
|   |   |__ api.js
│   └── package.json
│
├── backend/                  # NodeJS backend
│   ├── src/
│   │   ├── models/          # DB schemas/models
│   │   ├── routes/          # API endpoints
│   └── package.json
│
└── README.txt               # This file

Setup Instructions:
-------------------
1. Clone the repository:
   git clone https://github.com/yourusername/insyd-notification-poc.git
   cd insyd-notification-poc

2. Backend Setup:
   cd server
   npm install
   # Configure database connection in config file
   npm run dev

3. Frontend Setup:
   cd client
   npm install
   npm start

4. Access the Application:
   Frontend: http://localhost:3000
   Backend API: http://localhost:5000 (or configured port)

System Design Notes:
--------------------
- **Components**:
  * Frontend (ReactJS): Displays notifications
  * Backend (NodeJS): Processes events and sends notifications
  * Database: Stores users, content, and notification records
- **Execution Flow**:
  1. User performs an action (post, comment, like)
  2. Backend records the activity
  3. Notification service identifies affected users
  4. Notifications sent via WebSocket to frontend
- **Scale Considerations**:
  * POC designed for 100 DAUs
  * Can extend to 1 million DAUs by adding queues (RabbitMQ/Redis) and caching
- **Performance & Limitations**:
  * No authentication or authorization
  * No caching; all notifications fetched live from DB
  * Designed for functional POC only, not production

Deliverables:
----------------
- Frontend repository: https://insyd-notification-poc-alpha.vercel.app
- Backend repository: https://insyd-notification-poc-3.onrender.com
- Source Code: https://github.com/yourusername/insyd-notification-poc
