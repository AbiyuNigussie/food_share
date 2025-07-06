import React, { useEffect, useState } from "react";
import {
  getMessagesWithResponses,
  respondToContactMessage,
} from "../../services/contactService";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import {
  MailIcon,
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  SettingsIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  response?: {
    id: string;
    message: string;
    adminId: string;
    createdAt: string;
  } | null;
}

const navItems = [
  {
    label: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    href: "/dashboard",
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
];

const AdminContactPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { user } = useAuth();
  const token = user?.token || "";

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessagesWithResponses(token);
      setMessages(data);
    } catch (err: any) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const openResponseModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setResponseText("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
    setResponseText("");
  };

  const openViewModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedMessage(null);
  };

  const handleSendResponse = async () => {
    if (!selectedMessage) return;
    if (!responseText.trim()) {
      toast.error("Response cannot be empty");
      return;
    }
    try {
      await respondToContactMessage(selectedMessage.id, responseText, token);
      toast.success("Response sent!");
      closeModal();
      fetchMessages();
    } catch (err: any) {
      toast.error("Failed to send response");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-200 via-white to-indigo-100 rounded-3xl shadow-xl border border-purple-200">
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Admin Panel"
        navItems={navItems}
        userInfo={{ name: "Admin User", email: "admin@logistix.com" }}
      />

      <div
        className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header title="Contacts" />

        <main className="p-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MailIcon className="w-6 h-6 text-indigo-600" />
                Contact Messages
              </h1>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-white sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500 bg-gray-50 rounded-b-xl"
                      >
                        No messages found.
                      </td>
                    </tr>
                  )}
                  {messages.map((msg, idx) => (
                    <tr
                      key={msg.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-purple-50 transition-colors`}
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-gray-900">
                          {msg.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-indigo-700 font-medium">
                          {msg.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-gray-700">{msg.subject}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            msg.status === "Replied"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top flex gap-2">
                        <button
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold shadow"
                          onClick={() => openViewModal(msg)}
                        >
                          View
                        </button>
                        {!msg.response && (
                          <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow"
                            onClick={() => openResponseModal(msg)}
                          >
                            Respond
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* View Modal */}
          {viewModalOpen && selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in border border-gray-100">
                <button
                  onClick={closeViewModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="px-8 py-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MailIcon className="w-7 h-7 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      Message from {selectedMessage.name}
                    </h3>
                  </div>
                  <div className="mb-2 text-xs text-gray-400">
                    {selectedMessage.email} &middot;{" "}
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-gray-700 shadow-inner mb-4">
                    <span className="font-semibold">Subject:</span>{" "}
                    {selectedMessage.subject}
                    <div className="mt-2">
                      <span className="font-semibold">Message:</span>
                      <div className="mt-1 text-base">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                  {selectedMessage.response && (
                    <div className="mt-4">
                      <span className="font-semibold text-green-700">
                        Admin Response:
                      </span>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 mt-1 text-gray-700 shadow-inner">
                        {selectedMessage.response.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Response Modal */}
          {modalOpen && selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in border border-gray-100">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* Modal Content */}
                <div className="px-8 py-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MailIcon className="w-7 h-7 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      Respond to {selectedMessage.name}
                    </h3>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">
                      {selectedMessage.email}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-gray-700 shadow-inner">
                      <span className="font-semibold">Message:</span>
                      <div className="mt-1 text-base">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 mt-6">
                    Your Response
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 text-base transition resize-none bg-gray-50"
                    rows={5}
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
                      onClick={handleSendResponse}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Response"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tailwind animation for modal */}
          <style>{`
            .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1) both; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none;} }
          `}</style>
        </main>
      </div>
    </div>
  );
};

export default AdminContactPage;
