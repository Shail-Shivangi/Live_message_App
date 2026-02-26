# 💬 Real-Time Chat Application

A modern full-stack real-time chat application built using **Next.js, Convex, Clerk Authentication, and Tailwind CSS**.

This project implements real-time messaging, typing indicators, unread message badges, online/offline presence, smart auto-scroll, and WhatsApp-like UX behavior.

---

## 🚀 Features

### 🔐 Authentication
- Clerk-based user authentication
- Automatic user creation in database
- Secure session handling

### 💬 Real-Time Messaging
- Instant message delivery
- Auto-scroll for sender
- Smart scroll behavior for receiver

### 👀 Smart Auto-Scroll
- Auto-scroll if user is at bottom
- If scrolled up → show "↓ New Messages" button
- Clicking button scrolls to latest message
- WhatsApp-style behavior

### 🔔 Unread Message Badge
- Real-time unread message counter
- Badge increases when new message arrives
- Badge disappears when:
  - Chat is opened
  - User scrolls to bottom
  - "New Messages" button clicked

### ✍️ Typing Indicator
- Shows "Typing..." with animation
- Only visible to the other user
- Automatically disappears after inactivity
- Stops immediately when message is sent

### 🟢 Online / Offline Status
- Real-time online presence
- Last seen tracking
- Automatic status update on page load / unload

### 🔍 User Search
- Search all registered users
- Live filtering while typing
- Clicking user creates or opens conversation

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Convex (Real-time Database + Functions)
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

---

## 📁 Project Structure
/app
  /chat
/components
  ChatWindow.tsx
  ConversationList.tsx
  UserList.tsx
  Sidebar.tsx
/convex
  conversations.ts
  messages.ts
  typing.ts
  presence.ts
  schema.ts
---

##  ⚙️ Installation & Setup

1️⃣ `Clone the Repository `
  git clone https://github.com/Shail-Shivangi/Live_message_App

2️⃣ `Install Dependencies`
- npm install
3️⃣ `Setup Convex`
- npx convex dev
- If schema errors occur:
- npx convex dev --reset
4️⃣ `Configure Environment Variables`
Create a .env.local file:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
CONVEX_DEPLOYMENT=your_deployment
NEXT_PUBLIC_CONVEX_URL=your_url
5️⃣ `Run the Application`
- npm run dev
- Open in browser:
- http://localhost:3000

## 👩‍💻 Author

Shail Shivangi
MCA | Full-Stack Developer
Java | React | SQL | Blockchain Enthusiast

## 🔗 Public Repository Link
 https://github.com/Shail-Shivangi/Live_message_App

## 🚀 Live Demo
 Deployed on Vercel
 https://live-message-app.vercel.app

## 📜 License

This project is licensed under the MIT License.