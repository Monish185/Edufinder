import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateInstitute from "../pages/CreateInstitute";
import AdminRoute from "../context/AdminRoute";
import ProtectedRoute from "../context/ProtectedRoute";
import InstituteDetails from "../pages/InstituteDetails";
import Favorites from "../pages/Favorites";
import Subscribe from "../pages/Subscribe";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import AdminDashboard from "../pages/AdminDashboard";

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
    <div className="text-center">
      <p className="text-8xl font-extrabold text-indigo-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition">
        ← Back to Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/institutes/:id" element={<ProtectedRoute><InstituteDetails /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
      <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/create" element={<AdminRoute><CreateInstitute /></AdminRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
