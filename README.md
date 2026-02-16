# 🏡 Airbnb Clone - Fullstack Application

A powerful, full-stack Airbnb clone featuring a **React** frontend and a **Node.js/Express** backend. This application allows users to host properties, browse listings, and manage their favorites with real-time image uploads to **Cloudinary**.

---

## 🚀 Live Demo

- **Frontend:** [https://airbnb-frontend-eight.vercel.app](https://airbnb-frontend-eight.vercel.app)
- **Backend API:** [https://airbnb-fullstack-3vpb.onrender.com](https://airbnb-fullstack-3vpb.onrender.com)

---

## ✨ Features

- **🔐 Secure Authentication:** JWT-based login and signup with secure password hashing.
- **📸 Image Uploads:** Seamless image hosting via Cloudinary and Multer.
- **🏘️ Hosting System:** Full CRUD functionality for hosts to add, edit, or delete their listings.
- **❤️ Favorites/Wishlist:** Save your favorite homes to a personal wishlist.
- **🗺️ Interactive UI:** Modern, responsive design with smooth GSAP animations.
- **🛡️ Security:** Protected routes, CORS configuration, and Helmet for HTTP security headers.
- **🌐 Deployment Ready:** Optimized for Vercel (Frontend) and Render (Backend).

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide-React
- **Animations:** GSAP (GreenSock Animation Platform)
- **Routing:** React Router DOM

### **Backend**

- **Environment:** Node.js & Express
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JSON Web Token (JWT)
- **File Storage:** Cloudinary
- **Middleware:** Multer, Helmet, CORS, Express-Validator

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/kaifshahh/airbnb-fullstack.git
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd Airbnb
npm install
```

Create a `.env` file in the root of the backend folder:

```env
MONGO_URI=your_mongodb_uri
PORT=3000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../airbnb-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

---

## 📌 API Endpoints

### Store

- `GET /` - Fetch all listings
- `GET /homes/:homeId` - Get individual home details
- `POST /favourites` - Add home to favorites (Auth Required)

### Host

- `GET /host/host-home-list` - Fetch homes owned by host (Auth Required)
- `POST /host/add-home` - Add a new home with image (Auth Required)
- `POST /host/edit-home` - Update home details (Auth Required)
- `POST /host/delete-home/:homeId` - Delete a listing (Auth Required)

---

## 🤝 Conclusion

This project demonstrates modern full-stack development skills, including state management, RESTful API design, database modeling, and third-party service integration.

Developed with ❤️ by [Kaif Shah](https://github.com/kaifshahh)
