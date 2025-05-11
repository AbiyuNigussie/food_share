import React, { useState } from "react";
import {
  ArrowLeftIcon,
  MapIcon,
  SatelliteIcon,
  TrafficCone,
  PlusIcon,
  MinusIcon,
  HomeIcon,
} from "lucide-react";
const Tab = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
      active
        ? "bg-purple-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </button>
);

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-lg shadow p-4 flex-1">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="mt-1 font-semibold text-gray-800">{value}</p>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-medium text-gray-700 mb-2">{children}</h3>
);

const DriverInfo = ({
  name,
  vehicle,
  onContact,
}: {
  name: string;
  vehicle: string;
  onContact: () => void;
}) => (
  <div className="bg-white rounded-lg shadow p-4 space-y-2">
    <SectionTitle>Driver Information</SectionTitle>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
        <span>👤</span>
      </div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{vehicle}</p>
      </div>
    </div>
    <button
      onClick={onContact}
      className="w-full mt-2 py-1 text-sm text-purple-600 border border-purple-600 rounded hover:bg-purple-50"
    >
      Contact Driver
    </button>
  </div>
);

const LocationCard = ({
  icon,
  title,
  address,
}: {
  icon: React.ReactNode;
  title: string;
  address: string;
}) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-start space-x-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{address}</p>
    </div>
  </div>
);

const Checkpoint = ({
  label,
  time,
  address,
  status,
}: {
  label: string;
  time: string;
  address: string;
  status: "completed" | "in_progress" | "pending";
}) => {
  const colors = {
    completed: "text-green-600",
    in_progress: "text-orange-500",
    pending: "text-gray-400",
  } as const;
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-1 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "completed"
                ? "bg-green-600"
                : status === "in_progress"
                ? "bg-orange-500"
                : "bg-gray-400"
            }`}
          />
          <p className="font-medium text-gray-800">{label}</p>
        </div>
        <span className={`text-xs ${colors[status]}`}>{status}</span>
      </div>
      <p className="text-xs text-gray-500">{time}</p>
      <p className="text-xs text-gray-500">{address}</p>
    </div>
  );
};

export const LiveTrackingPage: React.FC = () => {
  const [tab, setTab] = useState<"default" | "satellite" | "traffic">(
    "default"
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-96 p-6 space-y-6 overflow-y-auto">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Live Tracking</span>
        </button>
        <p className="text-xs text-gray-500">
          Tracking ID: <span className="font-medium">DEL-2024-001</span>
        </p>

        <div className="flex space-x-2">
          <Tab
            icon={MapIcon}
            label="Default"
            active={tab === "default"}
            onClick={() => setTab("default")}
          />
          <Tab
            icon={SatelliteIcon}
            label="Satellite"
            active={tab === "satellite"}
            onClick={() => setTab("satellite")}
          />
          <Tab
            icon={TrafficCone}
            label="Traffic"
            active={tab === "traffic"}
            onClick={() => setTab("traffic")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard title="Estimated Arrival" value="2024-01-21 14:30" />
          <InfoCard title="Distance Remaining" value="2.3 miles" />
        </div>

        <DriverInfo
          name="Michael Brown"
          vehicle="White Van – XYZ 789"
          onContact={() => alert("Contacting driver…")}
        />

        <div className="space-y-2">
          <SectionTitle>Route Details</SectionTitle>
          <LocationCard
            icon={<MapIcon className="w-5 h-5 text-purple-600" />}
            title="Local Farm Co"
            address="123 Farm Road, Rural County"
          />
          <LocationCard
            icon={<HomeIcon className="w-5 h-5 text-purple-600" />}
            title="Community Food Bank"
            address="456 Main Street, Urban City"
          />
        </div>

        <div className="space-y-2 mb-6">
          <SectionTitle>Checkpoints</SectionTitle>
          <Checkpoint
            label="Checkpoint 1"
            time="10:15 AM"
            address="789 Route St"
            status="completed"
          />
          <Checkpoint
            label="Checkpoint 2"
            time="10:45 AM"
            address="321 Path Ave"
            status="in_progress"
          />
          <Checkpoint
            label="Checkpoint 3"
            time="11:15 AM"
            address="654 Road Ln"
            status="pending"
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute top-6 right-6 flex flex-col space-y-2 bg-white rounded shadow p-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MinusIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <HomeIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="w-full h-full bg-gray-200" />
      </div>
    </div>
  );
};
