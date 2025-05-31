import SectionTitle from "./SectionTitle";

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

export default DriverInfo;
