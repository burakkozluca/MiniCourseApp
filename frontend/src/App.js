import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LocalCartProvider } from "./context/LocalCartContext";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import PaymentPage from "./pages/cart/PaymentPage";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import Cart from "./pages/cart/Cart";
import CourseDetail from "./pages/courses/CourseDetail";
import Admin from "./pages/admin/Admin";
import { AuthGuard } from './guards/AuthGuard';
import { AdminGuard } from './guards/AdminGuard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';
import Register from './pages/auth/Register';
import PaymentSuccess from './pages/cart/PaymentSuccess';
import MyCourses from './pages/courses/MyCourses';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CourseContent from './pages/courses/CourseContent';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <LocalCartProvider>
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
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/password-reset" element={<ResetPassword />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/cart" element={<Cart />} />

                {/* Protected Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/my-courses" element={<MyCourses />} />
                  <Route path="/learn/:id" element={<CourseContent />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </LocalCartProvider>
    </BrowserRouter>
  );
}