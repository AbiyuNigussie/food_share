import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { BarChart2Icon, HomeIcon, GiftIcon, SettingsIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { Header } from "../components/Header";
import { SideBar, NavItem } from "../components/SideBar";
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
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

interface MonthlyStat {
  label: string;
  matched: number;
  claimed: number;
}

export const DonorInsightsPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";
  const [stats, setStats] = useState<MonthlyStat[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [recentDonations, setRecentDonations] = useState<
    { date: string; amount: number; foodType: string }[]
  >([]);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: "My Donations",
      icon: <GiftIcon className="w-5 h-5" />,
      href: "/dashboard/Donor-Donations",
    },
    {
      label: "Insights",
      icon: <BarChart2Icon className="w-5 h-5" />,
      href: "/dashboard/donor-insights",
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
        const res = await authService.getDonorInsights(token);
        const data = res.data.data;
        if (
          data &&
          typeof data.total === "number" &&
          Array.isArray(data.monthly)
        ) {
          const now = new Date();
          const monthLabels: string[] = [];
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            monthLabels.push(monthNames[d.getMonth()]);
          }
          const mapped: MonthlyStat[] = data.monthly.map(
            (val: any, idx: number) => ({
              label: monthLabels[idx],
              matched: val.matched,
              claimed: val.claimed,
            })
          );
          setStats(mapped);
          setTotalDonations(data.total);
        }
      } catch (err) {
        console.error("Failed to load insights", err);
      }
    }
    fetchInsights();

    // Fetch recent donations with foodType
    async function fetchRecentDonations() {
      try {
        const res = await authService.getDonorDonations(token, 1, 5);
        setRecentDonations(
          res.data.data.map((don: any) => ({
            date: don.createdAt, // or format as needed
            amount: don.quantity, // or don.amount if that's correct
            foodType: don.foodType,
          }))
        );
      } catch (err) {
        console.error("Failed to load recent donations", err);
      }
    }
    fetchRecentDonations();
  }, [token]);

  // Chart Data
  const labels = stats.map((s) => s.label);
  const matchedData = stats.map((s) => s.matched);
  const claimedData = stats.map((s) => s.claimed);

  const barData = {
    labels,
    datasets: [
      {
        label: "Matched",
        data: matchedData,
        backgroundColor: "#A78BFA",
        borderRadius: 6,
        maxBarThickness: 36,
      },
      {
        label: "Claimed",
        data: claimedData,
        backgroundColor: "#34D399",
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Matched",
        data: matchedData,
        borderColor: "#A78BFA",
        backgroundColor: "rgba(167,139,250,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#A78BFA",
      },
      {
        label: "Claimed",
        data: claimedData,
        borderColor: "#34D399",
        backgroundColor: "rgba(52,211,153,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#34D399",
      },
    ],
  };

  const doughnutData = {
    labels: ["Matched", "Claimed"],
    datasets: [
      {
        data: [
          matchedData.reduce((a, b) => a + b, 0),
          claimedData.reduce((a, b) => a + b, 0),
        ],
        backgroundColor: ["#A78BFA", "#34D399"],
      },
    ],
  };

  return (
    <>
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        title="Donor Portal"
        logoIcon={<GiftIcon className="w-6 h-6 text-purple-600" />}
        navItems={navItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />

      <main
        className={clsx(
          "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header title="DONOR INSIGHTS" />

        <div className="max-w-7xl mx-auto space-y-8 mt-6 w-full">
          {/* Top Card */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-white">
              <span className="text-lg font-semibold tracking-wide mb-2">
                Total Donations
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-70 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-extrabold">
                    {totalDonations}
                  </span>
                  <span className="text-md opacity-80 mt-1">All‑time</span>
                </div>
                {(() => {
                  const totalMatched = stats.reduce((a, b) => a + b.matched, 0);
                  const totalClaimed = stats.reduce((a, b) => a + b.claimed, 0);
                  const percentMatched = totalDonations
                    ? Math.round((totalMatched / totalDonations) * 100)
                    : 0;
                  const percentClaimed = totalDonations
                    ? Math.round((totalClaimed / totalDonations) * 100)
                    : 0;
                  return (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold text-purple-200">
                          {percentMatched}%
                        </span>
                        <span className="text-md opacity-80 mt-1">Matched</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold text-green-200">
                          {percentClaimed}%
                        </span>
                        <span className="text-md opacity-80 mt-1">Claimed</span>
                      </div>
                    </>
                  );
                })()}
              </div>
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
                  plugins: { legend: { display: true } },
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
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
                height={320}
              />
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center h-[400px]">
              <h3 className="font-semibold text-gray-700 mb-2">
                Matched vs Claimed
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

          {/* Recent Donations List (optional) */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Recent Donations
            </h3>
            <ul className="divide-y divide-gray-100">
              {recentDonations.map((don, idx) => (
                <li
                  key={idx}
                  className="py-3 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">
                    {don.foodType}
                  </span>
                  <span className="text-gray-500">{don.date}</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {don.amount}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
};
