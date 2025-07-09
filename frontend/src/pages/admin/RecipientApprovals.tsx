import React, { useEffect, useState } from "react";
import {
  fetchPendingRecipients,
  approveRecipient,
  rejectRecipient,
} from "../../api/admin";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { SideBar } from "../../components/SideBar";
import {
  ClipboardListIcon,
  HomeIcon,
  UsersIcon,
  BellIcon,
  SettingsIcon,
  FileTextIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  MailIcon,
} from "lucide-react";
import ReactDOM from "react-dom";

interface Recipient {
  userId: string;
  organization?: string;
  legalName: string;
  registrationNumber: string;
  country: string;
  website?: string;
  contactPersonTitle?: string;
  organizationType: string;
  businessRegistrationDoc?: string;
  taxIdDoc?: string;
  proofOfAddressDoc?: string;
  isApproved: boolean;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  // fallback for old fields
  businessRegistrationDocUrl?: string;
  taxIdDocUrl?: string;
  proofOfAddressDocUrl?: string;
  email?: string;
  phoneNumber?: string;
}

const RecipientApprovals: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingRecipients();
      setRecipients(res.data);
    } catch (err) {
      toast.error("Failed to fetch recipients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveRecipient(id);
      toast.success("Recipient approved");
      setRecipients((prev) => prev.filter((r) => r.userId !== id));
    } catch {
      toast.error("Failed to approve recipient");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRecipient(id);
      toast.success("Recipient rejected");
      setRecipients((prev) => prev.filter((r) => r.userId !== id));
    } catch {
      toast.error("Failed to reject recipient");
    }
  };

  // Sidebar nav items (same as AdminDashboard)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = [
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
  ];

  // Modal state for docs
  interface OrgModal {
    business?: string;
    tax?: string;
    address?: string;
    org: Recipient;
  }
  const [docModal, setDocModal] = useState<OrgModal | null>(null);

  // Dropdown state for actions
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only close dropdown if click is outside any dropdown menu or button
      const target = e.target as HTMLElement;
      if (
        !target.closest(".dropdown-action-menu") &&
        !target.closest(".dropdown-action-btn")
      ) {
        setDropdownOpen(null);
      }
    };
    if (dropdownOpen) {
      window.addEventListener("mousedown", handleClick);
      return () => window.removeEventListener("mousedown", handleClick);
    }
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen">
      <SideBar
        open={sidebarOpen}
        toggle={() => setSidebarOpen((o) => !o)}
        title="Admin Panel"
        navItems={navItems}
        userInfo={{
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email || "",
        }}
      />
      <div
        className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 text-purple-700">
            Pending Recipient Approvals
          </h1>
          {loading ? (
            <div>Loading...</div>
          ) : recipients.length === 0 ? (
            <div className="text-gray-500">No pending recipients.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-white sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Legal Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reg #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    {/* Removed Contact and Docs columns */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((r) => (
                    <React.Fragment key={r.userId}>
                      <tr className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700 font-semibold">
                          {r.legalName}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {r.registrationNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{r.country}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {r.organizationType}
                        </td>
                        {/* Removed Contact and Docs cells */}
                        <td className="px-6 py-4 relative">
                          <div className="inline-block text-left">
                            <button
                              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none dropdown-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = (
                                  e.target as HTMLElement
                                ).getBoundingClientRect();
                                setDropdownOpen(
                                  dropdownOpen === r.userId ? null : r.userId
                                );
                                setDropdownPos(
                                  dropdownOpen === r.userId
                                    ? null
                                    : {
                                        top: rect.bottom + window.scrollY,
                                        left: rect.right - 160,
                                      }
                                );
                              }}
                              title="Actions"
                            >
                              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            {dropdownOpen === r.userId &&
                              dropdownPos &&
                              ReactDOM.createPortal(
                                <div
                                  className="dropdown-action-menu fixed w-40 bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
                                  style={{
                                    top: dropdownPos.top + 8,
                                    left: dropdownPos.left,
                                  }}
                                >
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 text-gray-700"
                                    onClick={() => {
                                      setDocModal({
                                        org: r,
                                        ...(r.businessRegistrationDocUrl
                                          ? {
                                              business:
                                                r.businessRegistrationDocUrl,
                                            }
                                          : {}),
                                        ...(r.taxIdDocUrl
                                          ? { tax: r.taxIdDocUrl }
                                          : {}),
                                        ...(r.proofOfAddressDocUrl
                                          ? { address: r.proofOfAddressDocUrl }
                                          : {}),
                                      });
                                      setDropdownOpen(null);
                                      setDropdownPos(null);
                                    }}
                                  >
                                    <FileTextIcon className="inline w-4 h-4 mr-2 text-purple-500" />{" "}
                                    View Details
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700"
                                    onClick={() => {
                                      handleApprove(r.userId);
                                      setDropdownOpen(null);
                                      setDropdownPos(null);
                                    }}
                                  >
                                    <CheckCircleIcon className="inline w-4 h-4 mr-2 text-green-500" />{" "}
                                    Approve
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700"
                                    onClick={() => {
                                      handleReject(r.userId);
                                      setDropdownOpen(null);
                                      setDropdownPos(null);
                                    }}
                                  >
                                    <XCircleIcon className="inline w-4 h-4 mr-2 text-red-500" />{" "}
                                    Reject
                                  </button>
                                </div>,
                                document.body
                              )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Modal for viewing org details and docs */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setDocModal(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center mb-6">
              <ClipboardListIcon className="w-8 h-8 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-purple-700">
                Organization Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-purple-50 rounded-lg p-6 shadow-sm flex flex-col gap-5">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Organization Name
                  </div>
                  <div className="text-base text-gray-800">
                    {docModal.org.organization}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Legal Name</div>
                  <div className="text-base text-gray-800">
                    {docModal.org.legalName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Registration Number
                  </div>
                  <div className="text-base text-gray-800">
                    {docModal.org.registrationNumber}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Country</div>
                  <div className="text-base text-gray-800">
                    {docModal.org.country}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Organization Type
                  </div>
                  <div className="text-base text-gray-800">
                    {docModal.org.organizationType}
                  </div>
                </div>
                {docModal.org.website && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Website</div>
                    <a
                      href={docModal.org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 underline"
                    >
                      {docModal.org.website}
                    </a>
                  </div>
                )}
                {docModal.org.contactPersonTitle && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Contact Person Title
                    </div>
                    <div className="text-base text-gray-800">
                      {docModal.org.contactPersonTitle}
                    </div>
                  </div>
                )}
                {docModal.org.user && (
                  <>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact First Name
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.user.firstName || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact Last Name
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.user.lastName || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact Email
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.user.email || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact Phone
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.user.phoneNumber || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {!docModal.org.user && (
                  <>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact Email
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.email || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Contact Phone
                      </div>
                      <div className="text-base text-gray-800">
                        {docModal.org.phoneNumber || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="font-semibold mb-4 flex items-center text-gray-700">
                  <FileTextIcon className="w-5 h-5 mr-2 text-purple-500" />{" "}
                  Uploaded Documents
                </div>
                <ul className="space-y-4">
                  {(docModal.org.businessRegistrationDoc ||
                    docModal.org.businessRegistrationDocUrl) && (
                    <li className="flex items-center bg-white rounded shadow p-3">
                      <FileTextIcon className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="flex-1 text-gray-800">
                        Business Registration Certificate
                      </span>
                      <a
                        href={
                          docModal.org.businessRegistrationDoc ||
                          docModal.org.businessRegistrationDocUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition text-sm"
                      >
                        View
                      </a>
                    </li>
                  )}
                  {(docModal.org.taxIdDoc || docModal.org.taxIdDocUrl) && (
                    <li className="flex items-center bg-white rounded shadow p-3">
                      <FileTextIcon className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="flex-1 text-gray-800">
                        Tax ID / Charity Status Document
                      </span>
                      <a
                        href={docModal.org.taxIdDoc || docModal.org.taxIdDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition text-sm"
                      >
                        View
                      </a>
                    </li>
                  )}
                  {(docModal.org.proofOfAddressDoc ||
                    docModal.org.proofOfAddressDocUrl) && (
                    <li className="flex items-center bg-white rounded shadow p-3">
                      <FileTextIcon className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="flex-1 text-gray-800">
                        Proof of Address
                      </span>
                      <a
                        href={
                          docModal.org.proofOfAddressDoc ||
                          docModal.org.proofOfAddressDocUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition text-sm"
                      >
                        View
                      </a>
                    </li>
                  )}
                  {!(
                    docModal.org.businessRegistrationDoc ||
                    docModal.org.taxIdDoc ||
                    docModal.org.proofOfAddressDoc ||
                    docModal.org.businessRegistrationDocUrl ||
                    docModal.org.taxIdDocUrl ||
                    docModal.org.proofOfAddressDocUrl
                  ) && <li className="text-gray-400">No documents uploaded</li>}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => {
                  handleApprove(docModal.org.userId);
                  setDocModal(null);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleReject(docModal.org.userId);
                  setDocModal(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow"
              >
                Reject
              </button>
              <button
                onClick={() => setDocModal(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientApprovals;
