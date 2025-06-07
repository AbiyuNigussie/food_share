const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-lg shadow p-4 flex-1">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="mt-1 font-semibold text-gray-800">{value}</p>
  </div>
);

export default InfoCard;
