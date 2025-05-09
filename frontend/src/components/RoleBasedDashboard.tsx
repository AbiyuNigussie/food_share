import { useAuth } from "../contexts/AuthContext";
import RecipientDashboard from "./dashboards/RecipientDashboard";
import { Logistics } from "./dashboards/Logistics";
import AdminDashboard from "./dashboards/AdminDashboard";
import { DonorDashboard } from "./dashboards/DonorDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "DONOR":
      return <DonorDashboard />;
    case "RECIPIENT":
      return <RecipientDashboard />;
    case "LOGISTIC_PROVIDER":
      return <Logistics />;
    case "ADMINISTRATOR":
      return <AdminDashboard />;
    default:
      return <p>Unauthorized role</p>;
  }
}
