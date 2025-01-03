import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import PaymentForm from "./pages/PaymentForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CourseDetail from "./pages/CourseDetail";
import Admin from "./pages/Admin";
import { AuthGuard } from './guards/AuthGuard';
import { AdminGuard } from './guards/AdminGuard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';

// Layout component for public and protected routes
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
            <Route path="/admin" element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }>
              <Route index element={<Admin />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/course/:id" element={<CourseDetail />} />
            
              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<PaymentForm />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}