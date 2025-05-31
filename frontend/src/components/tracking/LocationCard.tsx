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

export default LocationCard;
