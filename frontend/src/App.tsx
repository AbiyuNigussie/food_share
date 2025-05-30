import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import DashboardPage from "./pages/Dashboard";
import { DeliveryDetails } from "./pages/DeliveryDetails";
import { LiveTrackingPage } from "./pages/LiveTrackingPage";
import AdminLogin from "./pages/auth/admin/AdminLogin";
import AdminRegister from "./pages/auth/admin/AdminRegister";
import { RecipientNeeds } from "./pages/RecipientNeeds";
import { Deliveries } from "./pages/logistic_staff/Deliveries";
function App() {
  return (
    <AuthProvider>
      <>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            {/* Auth pages without header/footer */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              }
            />
            <Route
              path="/verify-email"
              element={
                <AuthLayout>
                  <VerifyEmail />
                </AuthLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthLayout>
                  <ForgotPassword />
                </AuthLayout>
              }
            />

            <Route
              path="/admin/login"
              element={
                <AuthLayout>
                  <AdminLogin />
                </AuthLayout>
              }
            />
            <Route
              path="/admin/register"
              element={
                <AuthLayout>
                  <AdminRegister />
                </AuthLayout>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <AuthLayout>
                  <ResetPassword />
                </AuthLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/deliveries/delivery-details/:id"
              element={
                <PrivateRoute>
                  <DeliveryDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/deliveries"
              element={
                <PrivateRoute>
                  <Deliveries />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/live-tracking"
              element={
                <PrivateRoute>
                  <LiveTrackingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/Recipient-Needs"
              element={
                <PrivateRoute>
                  <RecipientNeeds />
                </PrivateRoute>
              }
            />

            {/* Other pages with Main Layout
          {/* <Route path="/" element={<Home />} /> */}
          </Routes>
        </BrowserRouter>
      </>
    </AuthProvider>
  );
}

export default App;
