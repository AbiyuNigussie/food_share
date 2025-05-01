import { useAuth } from "../contexts/AuthContext";
import RecipientDashboard from "./dashboards/RecipientDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    // case 'DONOR':
    //   return <DonorDashboard />;
    case "RECIPIENT":
      return <RecipientDashboard />;
    // case 'LOGISTIC_PROVIDER':
    //   return <LogisticsDashboard />;
    default:
      return <p>Unauthorized role</p>;
  }
}
