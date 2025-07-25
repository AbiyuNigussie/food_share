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
import { RecipientDonationsPage } from "./pages/RecipientDonation";
import SubscriptionPage from "./pages/SubscripitionPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import FeedbackPage from "./pages/Feedback/Feedbackpage";
import { DonorInsightsPage } from "./pages/DonorInsightsPage";
import { RecipientInsightsPage } from "./pages/RecipientInsightsPage";
import { DonorDonationsPage } from "./pages/DonorDonationPage";
import ContactPage from "./pages/ContactPage";
import LandingPage from "./pages/landing/LandingPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import RecipientApprovals from "./pages/admin/RecipientApprovals";
import { SettingsPage } from "./pages/SettingsPage";
import { LogisticsHistoryPage } from "./pages/LogisticsHistoryPage";
import AdminReports from "./pages/admin/AdminReports";
import AdminContactPage from "./pages/admin/Contact";

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
            <Route path="/subscribe" element={<SubscriptionPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
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
              path="/admin/reports"
              element={
                <PrivateRoute>
                  <AdminReports />
                </PrivateRoute>
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
              path="/dashboard/my-donations/:id"
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

            <Route path="/tracking/:id" element={<LiveTrackingPage />} />
            <Route
              path="/dashboard/Recipient-Needs"
              element={
                <PrivateRoute>
                  <RecipientNeeds />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/my-donations"
              element={
                <PrivateRoute>
                  <RecipientDonationsPage />
                </PrivateRoute>
              }
            />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route
              path="/dashboard/donor-insights"
              element={
                <PrivateRoute>
                  <DonorInsightsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/recipient-insights"
              element={
                <PrivateRoute>
                  <RecipientInsightsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/Donor-Donations"
              element={
                <PrivateRoute>
                  <DonorDonationsPage />
                </PrivateRoute>
              }
            />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq/:role" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/admin/recipients/approvals"
              element={
                <PrivateRoute>
                  <RecipientApprovals />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq/:role" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/admin/contacts"
              element={
                <PrivateRoute>
                  <AdminContactPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/my-deliveries"
              element={
                <PrivateRoute>
                  <LogisticsHistoryPage />
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
