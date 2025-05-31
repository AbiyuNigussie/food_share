// src/components/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { AppNotification } from "../types";

export interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const token = user?.token || "";

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount and poll every 10s
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const data = await authService.getNotifications(token);
        const formatted: AppNotification[] = data.map((n: any) => ({
          id: n.id,
          message: n.message,
          meta: n.meta,
          readStatus: n.readStatus,
          createdAt: n.createdAt,
        }));

        setNotifications(formatted);
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
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Remove notification on dismiss or accept
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAccept = async (n: AppNotification) => {
    try {
      if (n.meta?.needId && n.meta?.donationId) {
        await authService.claimMatch(token, n.meta.needId, n.meta.donationId);
        toast.success("Donation accepted!");
      }
      await authService.markNotificationRead(n.id, token);
      removeNotification(n.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept donation.");
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await authService.markNotificationRead(id, token);
      removeNotification(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to dismiss notification.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  return (
    <div className="flex items-center justify-between mb-6 relative" ref={ref}>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative p-2 rounded-full transition hover:bg-gray-100 focus:outline-none"
        >
          <BellIcon className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-96 max-h-[400px] overflow-y-auto rounded-xl bg-white border border-gray-200 shadow-xl z-50 animate-fade-in">
            <div className="px-4 py-3 border-b text-base font-semibold text-gray-700">
              Notifications
            </div>
            <ul>
              {notifications.length === 0 ? (
                <li className="px-4 py-6 text-center text-gray-400">
                  No notifications
                </li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 border-b flex items-start justify-between gap-3 transition hover:bg-gray-50 ${
                      n.readStatus ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex-1 text-sm">
                      <p className="text-gray-800">{n.message}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {!n.readStatus && (
                        <button
                          onClick={() => handleAccept(n)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 focus:outline-none"
                        >
                          Accept
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(n.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 focus:outline-none"
                      >
                        Dismiss
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
