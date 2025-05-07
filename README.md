# 🍽️ BiteBuddy

**BiteBuddy** is a full-stack restaurant reservation and food ordering platform built to elevate the dining experience for both diners and restaurant owners. Users can discover restaurants, reserve tables, place orders, and restaurant owners can manage everything via an intuitive dashboard.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [📂 Available Scripts](#-available-scripts)
- [📫 Contact](#-contact)
- [🧾 License](#-license)

---

## ✨ Features

### 👥 Diner Features
- 🔍 Search for restaurants by name, cuisine, or location.
- 📄 View restaurant details including menus, pricing, and ratings.
- 📅 Reserve tables at restaurants.
- 🛒 Place food and drink orders.

### 🍽️ Restaurant Owner Features
- 🏪 Manage restaurant details including name, menu, and contact information.
- 📆 View and manage table reservations.
- 📋 Process and manage food orders.

### 🛡️ Admin Features
- 📊 Monitor restaurant statistics and analytics.
- 👥 Manage users and restaurant data.

### 🔄 Real-Time Features
- ⚡ WebSocket integration for real-time reservation and order updates.

---

## 🛠️ Tech Stack

### 🌐 Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### 🧠 Backend
- Node.js
- Express

### 🗄️ Database
- MySQL

### 🔐 Authentication
- JWT (JSON Web Token)

### 🔌 Real-Time Communication
- WebSockets (Socket.IO)

---

## 📦 Prerequisites

Ensure you have the following installed:

- ✅ [Node.js](https://nodejs.org/) (v14 or later)
- ✅ [MySQL Server](https://www.mysql.com/) (default user: `root`, password: `1234`)
- ✅ [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ShellyCS/BiteBuddy.git
cd BiteBuddy/Code
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Import the Database
```bash
npm run import-db
```

### 💻 Running the App
To start the development servers (frontend and backend concurrently):

```bash
npm run dev
```

### This command will:
- 🚀 Launch the frontend using Vite
- 🚀 Start the backend server (server/index.js)