# 🎓 EduFinder – Coaching Institute Listing Platform

A full-stack, production-ready listing platform for discovering coaching institutes across Noida, Delhi NCR, Jaipur, Maharashtra, Punjab, and other Indian cities. Built using React, Node.js, Express, MongoDB, Google Maps, Stripe, and Google OAuth.

---

## 🚀 Features

### Frontend
- **Listing Cards** – Responsive institute cards with image, rating, fees, category badges, and save-to-favorites
- **Advanced Search & Filters** – Search by name/city/category; filter by rating, fees, and institute type
- **Google Maps Integration** – Interactive map with institute markers, user location marker, map type toggle, fit-all-markers feature
- **Distance Calculation** – Calculates institute distance from user location using Haversine formula
- **Authentication** – Email/password login + Google OAuth authentication
- **Admin Dashboard** – Manage listings, monitor stats, and delete institutes
- **Payment Integration** – Stripe Checkout integration with premium subscription plans
- **Favorites System** – Save and manage favorite institutes
- **Responsive Design** – Mobile-first UI built with Tailwind CSS
- **SEO Optimized** – Meta tags, Open Graph, structured data, semantic HTML

---

## 🛠 Backend Features

- **REST APIs** with Express.js
- **MongoDB + Mongoose** integration
- **Geospatial Queries** using MongoDB 2dsphere indexes
- **JWT Authentication**
- **Cloudinary Image Uploads**
- **Protected Admin Routes**
- **Input Validation & Error Handling**
- **CORS & Helmet Security**
- **Payment Status Management**

---

## 🧰 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Google Maps API
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary
- Stripe

---

# 📸 Core Functionalities

✅ Listing Cards  
✅ Search & Filters  
✅ Google Maps Integration  
✅ Distance Calculation  
✅ User Location Detection  
✅ Authentication/Login  
✅ Admin Panel  
✅ Favorites Feature  
✅ Payment Gateway  
✅ Responsive UI  
✅ SEO Improvements  

---

## 📁 Project Structure

```bash
EduFinder/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
```

---

---

# 🛠 Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔑 Important API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/google` | Google OAuth Login |
| GET | `/api/institutes` | Get Institutes |
| GET | `/api/institutes/:id` | Get Single Institute |
| POST | `/api/institutes/create` | Create Institute |
| DELETE | `/api/institutes/:id` | Delete Institute |
| POST | `/api/payments/create-checkout-session` | Stripe Checkout |
| POST | `/api/payments/activate-plan` | Activate Subscription |
| GET | `/api/users/favorites` | Get Favorites |

---

# 📍 Google Maps Features

- User Location Marker
- Institute Markers
- Rich InfoWindows
- Satellite / Hybrid / Roadmap Toggle
- Fit All Markers Button
- Distance Display
- Responsive Map Layout

---

# 📈 SEO Improvements

- Dynamic Meta Tags
- Open Graph Tags
- Twitter Card Tags
- JSON-LD Structured Data
- Semantic HTML
- Lazy Loading Images
- Canonical URLs
- Optimized Accessibility

---

# 🎨 UI/UX Enhancements

- Sticky Navbar
- Mobile Hamburger Menu
- Animated Buttons & Hover Effects
- Responsive Grid/List Layout
- Interactive Filters
- Loading Skeletons
- Toast Notifications
- User Avatar Dropdown
- Beautiful Payment Success UI
- Rich Google Map Cards

---

# 🔒 Security Features

- Password Hashing with bcrypt
- JWT Authentication
- Protected Routes
- Admin Authorization
- Secure API Validation
- CORS Whitelisting
- Helmet Security Middleware

---

# 🌍 Deployment

## Frontend
Deployed on Vercel

## Backend
Deployed on Render

---

# 🧪 Demo Credentials

## Admin Account

Email: admin@edufinder.com  
Password: admin123

---

## Test User

Email: user@edufinder.com  
Password: user123

---

# 📦 Future Improvements

- AI-Based Institute Recommendations
- Real Reviews & Ratings
- Chat Support
- Multi-language Support
- Advanced Analytics Dashboard

---

# 👨‍💻 Author

Built with ❤️ using the MERN Stack.