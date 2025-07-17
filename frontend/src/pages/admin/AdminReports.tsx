import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { SideBar } from "../../components/SideBar";
import {
  ClipboardListIcon,
  HomeIcon,
  DownloadIcon,
  MailIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StatCard } from "../../components/StatCard";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useAuth } from "../../contexts/AuthContext";

dayjs.extend(isoWeek);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
interface Donor {
  user: User;
  address: string;
}
interface Recipient {
  user: User;
  address: string;
}
interface LogisticsStaff {
  user: User;
}

interface Delivery {
  id: string;
  deliveryStatus: string;
  updatedAt: string;
  pickupLocation?: { label: string };
  dropoffLocation?: { label: string };
  deliveredAt?: string;
  logisticsStaff?: LogisticsStaff;
}
interface ReportEntry {
  id: string;
  donor: Donor;
  recipient: Recipient;
  foodType: string;
  quantity: string;
  createdAt: string;
  status: string;
  delivery?: Delivery;
}

export default function AdminReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [donationPage, setDonationPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const rowsPerPage = 10;
  const [donationTrendMode, setDonationTrendMode] = useState<
    "day" | "week" | "month" | "year"
  >("month");
  const [deliveryTrendMode, setDeliveryTrendMode] = useState<
    "day" | "week" | "month" | "year"
  >("month");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/admin/report/donations`)
      .then((res) => res.json())
      .then((data) => setReports(Array.isArray(data.data) ? data.data : []))
      .catch((err) => console.error("Failed to fetch report:", err));
  }, []);

  // Split data for tables
  const donations = reports;
  const deliveries = reports.filter((r) => r.delivery);

  // Pagination logic
  const paginatedDonations = donations.slice(
    (donationPage - 1) * rowsPerPage,
    donationPage * rowsPerPage
  );
  const paginatedDeliveries = deliveries.slice(
    (deliveryPage - 1) * rowsPerPage,
    deliveryPage * rowsPerPage
  );
  const donationPageCount = Math.ceil(donations.length / rowsPerPage);
  const deliveryPageCount = Math.ceil(deliveries.length / rowsPerPage);

  const platformUsageData = {
    labels: ["Donors", "Recipients", "Logistics Staff"],
    datasets: [
      {
        label: "Users",
        data: [
          new Set(donations.map((r) => r.donor?.user.email)).size,
          new Set(donations.map((r) => r.recipient?.user.email)).size,
          new Set(donations.map((r) => r.delivery?.logisticsStaff?.user.email))
            .size,
        ],
        backgroundColor: ["#8B5CF6", "#EC4899", "#FBBF24"],
      },
    ],
  };

  // Calculate donation status counts
  const donationStatusCounts = donations.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const donationStatusLabels = Object.keys(donationStatusCounts);
  const donationStatusData = Object.values(donationStatusCounts);

  // Delivery status counts
  const deliveryStatusCounts = deliveries.reduce((acc, curr) => {
    const status = curr.delivery?.deliveryStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const deliveryStatusLabels = Object.keys(deliveryStatusCounts);
  const deliveryStatusData = Object.values(deliveryStatusCounts);

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    borderRadius: 8,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb" }, beginAtZero: true },
    },
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: { radius: 5, backgroundColor: "#3B82F6" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb" }, beginAtZero: true },
    },
  };
  const doughnutOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 18, padding: 18 },
      },
    },
    cutout: "70%",
  };

  // Export data
  const donationHeaders = [
    { label: "Donation ID", key: "id" },
    { label: "Donor Name", key: "donorName" },
    { label: "Recipient Name", key: "recipientName" },
    { label: "Food Type", key: "foodType" },
    { label: "Quantity", key: "quantity" },
    { label: "Status", key: "status" },
    { label: "Created At", key: "createdAt" },
  ];
  const donationExport = donations.map((r) => ({
    id: r.id,
    donorName: `${r.donor?.user.firstName} ${r.donor?.user.lastName}`,
    recipientName: `${r.recipient?.user.firstName} ${r.recipient?.user.lastName}`,
    foodType: r.foodType,
    quantity: r.quantity,
    status: r.status,
    createdAt: new Date(r.createdAt).toLocaleString(),
  }));

  const deliveryHeaders = [
    { label: "Delivery ID", key: "deliveryId" },
    { label: "Donation ID", key: "donationId" },
    { label: "Donor", key: "donor" },
    { label: "Recipient", key: "recipient" },
    { label: "Status", key: "status" },
    { label: "Pickup", key: "pickup" },
    { label: "Dropoff", key: "dropoff" },
    { label: "Updated At", key: "updatedAt" },
  ];
  const deliveryExport = deliveries.map((r) => ({
    deliveryId: r.delivery?.id,
    donationId: r.id,
    donor: `${r.donor?.user.firstName} ${r.donor?.user.lastName}`,
    recipient: `${r.recipient?.user.firstName} ${r.recipient?.user.lastName}`,
    status: r.delivery?.deliveryStatus,
    pickup: r.delivery?.pickupLocation?.label,
    dropoff: r.delivery?.dropoffLocation?.label,
    updatedAt: new Date(r.delivery?.updatedAt || "").toLocaleString(),
  }));

  // PDF Export functions
  const exportDonationsPDF = () => {
    const doc = new jsPDF();
    doc.text("Donations Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Donation ID",
          "Donor",
          "Recipient",
          "Food Type",
          "Quantity",
          "Status",
          "Created At",
        ],
      ],
      body: donations.map((r) => [
        r.id,
        `${r.donor?.user.firstName} ${r.donor?.user.lastName}`,
        `${r.recipient?.user.firstName} ${r.recipient?.user.lastName}`,
        r.foodType,
        r.quantity,
        r.status,
        new Date(r.createdAt).toLocaleString(),
      ]),
      styles: { fontSize: 9 },
    });
    doc.save("donations.pdf");
  };

  const exportDeliveriesPDF = () => {
    const doc = new jsPDF();
    doc.text("Deliveries Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Delivery ID",
          "Donation ID",
          "Donor",
          "Recipient",
          "Status",
          "Pickup",
          "Dropoff",
          "Updated At",
        ],
      ],
      body: deliveries.map((r) => [
        r.delivery?.id ?? "-",
        r.id ?? "-",
        `${r.donor?.user.firstName ?? ""} ${
          r.donor?.user.lastName ?? ""
        }`.trim(),
        `${r.recipient?.user.firstName ?? ""} ${
          r.recipient?.user.lastName ?? ""
        }`.trim(),
        r.delivery?.deliveryStatus ?? "-",
        r.delivery?.pickupLocation?.label ?? "-",
        r.delivery?.dropoffLocation?.label ?? "-",
        r.delivery?.updatedAt
          ? new Date(r.delivery.updatedAt).toLocaleString()
          : "-",
      ]),
      styles: { fontSize: 5 },
    });
    doc.save("deliveries.pdf");
  };

  // Impact metrics
  const totalDonations = donations.length;
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(
    (r) => r.delivery?.deliveryStatus === "DELIVERED"
  ).length;
  const pendingDeliveries = deliveries.filter(
    (r) => r.delivery?.deliveryStatus !== "DELIVERED"
  ).length;

  const allUserEmails = [
    ...donations.map((r) => r.donor?.user.email),
    ...donations.map((r) => r.recipient?.user.email),
    ...donations.map((r) => r.delivery?.logisticsStaff?.user.email),
  ].filter(Boolean);
  const totalUsers = new Set(allUserEmails).size;

  // Helper to group by mode
  function groupByMode(
    data: ReportEntry[],
    dateKey: "createdAt" | "delivery.updatedAt",
    mode: string
  ) {
    const map = new Map<string, number>();
    data.forEach((r) => {
      let dateVal =
        dateKey === "createdAt" ? r.createdAt : r.delivery?.updatedAt;
      if (!dateVal) return;
      let label = "";
      if (mode === "day") label = dayjs(dateVal).format("YYYY-MM-DD");
      if (mode === "week")
        label = `${dayjs(dateVal).year()}-W${dayjs(dateVal).isoWeek()}`;
      if (mode === "month") label = dayjs(dateVal).format("YYYY-MM");
      if (mode === "year") label = dayjs(dateVal).format("YYYY");
      map.set(label, (map.get(label) || 0) + 1);
    });
    // Sort labels
    const labels = Array.from(map.keys()).sort();
    return {
      labels,
      data: labels.map((l) => map.get(l) || 0),
    };
  }

  // Chart Data (grouped)
  const donationTrend = groupByMode(donations, "createdAt", donationTrendMode);
  const deliveryTrend = groupByMode(
    deliveries,
    "delivery.updatedAt",
    deliveryTrendMode
  );

  return (
    <div className="flex h-screen ">
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
        navItems={[
          {
            label: "Dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
            href: "/dashboard",
          },
          {
            label: "Recipient Approvals",
            icon: <ClipboardListIcon className="w-5 h-5" />,
            href: "/admin/recipients/approvals",
          },
          {
            label: "Reports",
            icon: <ClipboardListIcon className="w-5 h-5" />,
            href: "/admin/reports",
          },
          {
            label: "Contacts",
            icon: <MailIcon className="w-5 h-5" />,
            href: "/admin/contacts",
          },
          {
            label: "Settings",
            icon: <SettingsIcon className="w-5 h-5" />,
            href: "/admin/settings",
          },
        ]}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* <Header title="Reports" /> */}
        <main className="flex-1 p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardListIcon className="w-6 h-6 text-blue-600" />
              Admin Reports
            </h1>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Donations" value={totalDonations} />
            <StatCard label="Total Deliveries" value={totalDeliveries} />
            <StatCard
              label="Completed Deliveries"
              value={completedDeliveries}
            />
            <StatCard label="Pending Deliveries" value={pendingDeliveries} />
            <StatCard label="Total Users" value={totalUsers} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Donation Status
              </h2>
              <div className="w-full h-full">
                <Bar
                  data={{
                    labels: donationStatusLabels,
                    datasets: [
                      {
                        label: "Donations",
                        data: donationStatusData,
                        backgroundColor: [
                          "#10B981",
                          "#F59E0B",
                          "#3B82F6",
                          "#EC4899",
                          "#F43F5E",
                        ],
                      },
                    ],
                  }}
                  options={barOptions}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Donation Trend
                </h2>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={donationTrendMode}
                  onChange={(e) => setDonationTrendMode(e.target.value as any)}
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
              <div className="w-full h-full">
                <Line
                  data={{
                    labels: donationTrend.labels,
                    datasets: [
                      {
                        label: "Donations",
                        data: donationTrend.data,
                        fill: true,
                        borderColor: "#3B82F6",
                        backgroundColor: "rgba(59, 130, 246, 0.4)",
                      },
                    ],
                  }}
                  options={lineOptions}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Platform Usage
              </h2>
              <div className="w-full h-56 flex items-center justify-center">
                <Doughnut data={platformUsageData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Deliveries Analytics Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Deliveries Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {/* Delivery Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Delivery Status
                </h3>
                <div className="w-full h-full">
                  <Bar
                    data={{
                      labels: deliveryStatusLabels,
                      datasets: [
                        {
                          label: "Deliveries",
                          data: deliveryStatusData,
                          backgroundColor: [
                            "#34D399",
                            "#FBBF24",
                            "#F87171",
                            "#60A5FA",
                          ],
                        },
                      ],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
              {/* Delivery Trend Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Delivery Trend
                  </h3>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={deliveryTrendMode}
                    onChange={(e) =>
                      setDeliveryTrendMode(e.target.value as any)
                    }
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="w-full h-full">
                  <Line
                    data={{
                      labels: deliveryTrend.labels,
                      datasets: [
                        {
                          label: "Deliveries",
                          data: deliveryTrend.data,
                          fill: true,
                          borderColor: "#34D399",
                          backgroundColor: "rgba(52, 211, 153, 0.4)",
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
                </div>
              </div>
              {/* Delivery Platform Usage Chart */}
              {/* <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Platform Usage
                </h3>
                <div className="w-full h-56 flex items-center justify-center">
                  <Doughnut
                    data={deliveryPlatformUsageData}
                    options={doughnutOptions}
                  />
                </div>
              </div> */}
            </div>
          </div>

          {/* Donations Table */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-700">Donations</h2>
              <div className="flex gap-2">
                <CSVLink
                  data={donationExport}
                  headers={donationHeaders}
                  filename="donations.csv"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" /> Export CSV
                </CSVLink>
                <button
                  onClick={exportDonationsPDF}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" /> Export PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-purple-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-xl">
                      Donation ID
                    </th>
                    <th className="px-4 py-3 font-semibold">Donor</th>
                    <th className="px-4 py-3 font-semibold">Recipient</th>
                    <th className="px-4 py-3 font-semibold">Food Type</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-xl">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDonations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No donations found.
                      </td>
                    </tr>
                  ) : (
                    paginatedDonations.map((report, idx) => (
                      <tr
                        key={report.id}
                        className={`${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } border-t hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-4 py-3">{report.id}</td>
                        <td className="px-4 py-3">{`${report.donor?.user.firstName} ${report.donor?.user.lastName}`}</td>
                        <td className="px-4 py-3">{`${report.recipient?.user.firstName} ${report.recipient?.user.lastName}`}</td>
                        <td className="px-4 py-3">{report.foodType}</td>
                        <td className="px-4 py-3">{report.quantity}</td>
                        <td className="px-4 py-3 capitalize">
                          {report.status}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(report.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-end mt-2 gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={donationPage === 1}
                onClick={() => setDonationPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="px-2 py-1">
                {donationPage} / {donationPageCount}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={donationPage === donationPageCount}
                onClick={() =>
                  setDonationPage((p) => Math.min(donationPageCount, p + 1))
                }
              >
                Next
              </button>
            </div>
          </div>

          {/* Deliveries Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Deliveries
              </h2>
              <div className="flex gap-2">
                <CSVLink
                  data={deliveryExport}
                  headers={deliveryHeaders}
                  filename="deliveries.csv"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" /> Export CSV
                </CSVLink>
                <button
                  onClick={exportDeliveriesPDF}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" /> Export PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-purple-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-xl">
                      Delivery ID
                    </th>
                    <th className="px-4 py-3 font-semibold">Donation ID</th>
                    <th className="px-4 py-3 font-semibold">Donor</th>
                    <th className="px-4 py-3 font-semibold">Recipient</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Pickup</th>
                    <th className="px-4 py-3 font-semibold">Dropoff</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-xl">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeliveries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No deliveries found.
                      </td>
                    </tr>
                  ) : (
                    paginatedDeliveries.map((report, idx) => (
                      <tr
                        key={report.delivery?.id}
                        className={`${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } border-t hover:bg-green-50 transition-colors`}
                      >
                        <td className="px-4 py-3">{report.delivery?.id}</td>
                        <td className="px-4 py-3">{report.id}</td>
                        <td className="px-4 py-3">{`${report.donor?.user.firstName} ${report.donor?.user.lastName}`}</td>
                        <td className="px-4 py-3">{`${report.recipient?.user.firstName} ${report.recipient?.user.lastName}`}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              report.delivery?.deliveryStatus === "DELIVERED"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {report.delivery?.deliveryStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {report.delivery?.pickupLocation?.label || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {report.delivery?.dropoffLocation?.label || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(
                            report.delivery?.updatedAt || ""
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-end mt-2 gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={deliveryPage === 1}
                onClick={() => setDeliveryPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="px-2 py-1">
                {deliveryPage} / {deliveryPageCount}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={deliveryPage === deliveryPageCount}
                onClick={() =>
                  setDeliveryPage((p) => Math.min(deliveryPageCount, p + 1))
                }
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
