import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
function App() {
  return (
    <AuthProvider>
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
            path="/reset-password"
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />
          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          /> */}

          {/* Other pages with Main Layout
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
