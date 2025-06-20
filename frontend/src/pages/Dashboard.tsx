import RoleBasedDashboard from "../components/RoleBasedDashboard";

export default function DashboardPage() {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-200 via-white to-indigo-100 rounded-3xl shadow-xl border border-purple-200">
      <RoleBasedDashboard />
    </div>
  );
}
