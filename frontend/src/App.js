import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CourseDetail from "./pages/CourseDetail";
import Admin from "./pages/Admin";
import { AuthGuard } from './guards/AuthGuard';
import { AdminGuard } from './guards/AdminGuard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import MyCourses from './pages/MyCourses';
import './App.css';

const MainLayout = () => (
  <>
    <Navbar />
    <div className="main-content">
      <Outlet />
    </div>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes */}
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>

            {/* Main Layout */}
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/course/:id" element={<CourseDetail />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/my-courses" element={<MyCourses />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}