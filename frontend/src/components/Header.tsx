// src/components/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { AppNotification } from "../types";


export interface Notification {
  id: string;
  message: string;
  meta: { needId: string; donationId: string };
  readStatus: boolean;
  createdAt: string;
}

export interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const token = user?.token || "";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount and poll every 10s
  useEffect(() => {
    if (!token) return;

const fetchNotifications = async () => {
  try {
    const data = await authService.getNotifications(token);
    
    // OPTIONAL: Map response to expected structure if needed
    const formatted: AppNotification[] = data.map((n: any) => ({
      id: n.id,
      message: n.message,
      meta: n.meta,
      readStatus: n.readStatus,
      createdAt: n.createdAt,
    }));

    setNotifications(formatted); // ✅ now the type matches
    setUnreadCount(formatted.filter((n) => !n.readStatus).length);
  } catch (err) {
    console.error("Failed to fetch notifications", err);
  }
};


    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const markRead = async (id: string) => {
    try {
      await authService.markNotificationRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
      );
      setUnreadCount((c) => c - 1);
    } catch (err) {
      console.error("Failed to mark read", err);
      toast.error("Could not mark notification read");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 relative" ref={ref}>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <BellIcon className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block w-2 h-2 bg-purple-600 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50">
          <div className="p-3 border-b text-sm font-medium">Notifications</div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-3 text-center text-gray-500">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-2 flex justify-between items-start space-x-2 hover:bg-gray-50 ${
                    n.readStatus ? "" : "bg-gray-100"
                  }`}
                >
                  <div className="flex-1 text-sm text-gray-800">
                    {n.message}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.readStatus && (
                    <>
                      {n.meta && n.meta.needId && n.meta.donationId ? (
                        <button
                          onClick={async () => {
                            try {
                              await authService.claimMatch(
                                token,
                                n.meta.needId,
                                n.meta.donationId
                              );
                              toast.success(
                                "Donation accepted! Logistics has been notified."
                              );
                              markRead(n.id);
                            } catch (err) {
                              console.error(err);
                              toast.error("Failed to accept donation.");
                            }
                          }}
                          className="text-green-600 text-xs hover:underline"
                        >
                          Accept
                        </button>
                      ) : (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          Dismiss
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
