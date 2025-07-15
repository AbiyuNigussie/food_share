// src/pages/RecipientInsightsPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler, // <-- ADD THIS
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  MapPinIcon,
  HomeIcon,
  BarChart2Icon,
  GiftIcon,
  SettingsIcon,
  PackageIcon,
  ClipboardListIcon,
} from "lucide-react";
import { SideBar, NavItem } from "../components/SideBar";
import { Header } from "../components/Header";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler // <-- AND THIS
);

type ReceiveStat = { month: string; volume: number };

export const RecipientInsightsPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token!;
  const [stats, setStats] = useState<ReceiveStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedYear] = useState(new Date().getFullYear());
  const [totalLbs, setTotalLbs] = useState(0);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: "My Claims",
      icon: <PackageIcon className="w-5 h-5" />,
      href: "/dashboard/my-donations",
    },
    {
      label: "Insights",
      icon: <BarChart2Icon />,
      href: "/dashboard/recipient-insights",
    },
    {
      label: "My Needs",
      icon: <ClipboardListIcon className="w-5 h-5" />,
      href: "/dashboard/recipient-needs",
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "/dashboard/settings",
    },
  ];

  useEffect(() => {
    async function fetchInsights() {
      try {
        console.log("Fetching insights...");
        const res = await authService.getRecipientInsights(token);
        console.log("Insights response:", res.data);
        setStats(res.data.data.monthly || []);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [token]);

  useEffect(() => {
    async function fetchInsights() {
      const res = await authService.getRecipientInsights(token);
      setStats(res.data.data.monthly || []);
      setTotalLbs(res.data.data.totalLbs || 0);
    }
    fetchInsights();
  }, [token, selectedYear]);

  if (loading) return <div className="p-6 text-center">Loading insights…</div>;

  const totalReceived = stats.reduce((sum, s) => sum + s.volume, 0);

  // Chart data
  const labels = stats.map((s) => {
    const [year, month] = s.month.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "short",
    });
  });
  const volumes = stats.map((s) => s.volume);

  const barData = {
    labels,
    datasets: [
      {
        label: "Received",
        data: volumes,
        backgroundColor: "#A78BFA",
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Received",
        data: volumes,
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#6366F1",
      },
    ],
  };

  const doughnutData = {
    labels,
    datasets: [
      {
        data: volumes,
        backgroundColor: [
          "#A78BFA",
          "#C4B5FD",
          "#DDD6FE",
          "#F3E8FF",
          "#EDE9FE",
          "#E0E7FF",
          "#C7D2FE",
          "#A5B4FC",
          "#818CF8",
          "#6366F1",
          "#4F46E5",
          "#4338CA",
        ],
      },
    ],
  };

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        title="Recipient Portal"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={
          "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 transition-all duration-200 " +
          (sidebarOpen ? "ml-64" : "ml-16")
        }
      >
        <Header title="RECIPIENT INSIGHTS" />

        <div className="max-w-7xl mx-auto space-y-8 mt-6 w-full">
          {/* Stat Card */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-white">
              <span className="text-lg font-semibold tracking-wide mb-2">
                Total Received
              </span>
              <span className="text-6xl font-extrabold">{totalReceived}</span>
              <span className="text-md opacity-80 mt-1">
                All‑time Donations received
              </span>
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center h-[400px]">
              <h3 className="font-semibold text-gray-700 mb-2">Bar Chart</h3>
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                height={320}
              />
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center h-[400px]">
              <h3 className="font-semibold text-gray-700 mb-2">Line Chart</h3>
              <Line
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
                height={320}
              />
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center h-[400px]">
              <h3 className="font-semibold text-gray-700 mb-2">
                Monthly Distribution
              </h3>
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
                height={320}
              />
            </div>
          </section>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <MapPinIcon className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-2xl font-bold">{stats.length}</span>
              <span className="text-gray-500">Months Tracked</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-2xl font-bold">{totalLbs}</span>
              <span className="text-gray-500">Total Received (lbs)</span>
            </div>
            {/* Add more stat cards as needed */}
          </div>
        </div>
      </main>
    </>
  );
};
