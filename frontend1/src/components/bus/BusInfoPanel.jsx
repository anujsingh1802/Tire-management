export default function BusInfoPanel({ bus }) {
  if (!bus) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-3">🚌 Bus Information</h3>

      <div className="space-y-1">
        <p><b>Bus Number:</b> {bus.busNumber}</p>
        <p><b>Status:</b> {bus.status}</p>
        <p><b>Total Tire Slots:</b> {bus.totalSlots}</p>
        <p><b>Bus ID:</b> {bus._id}</p>
      </div>

      <div className="mt-3 text-sm text-gray-500">
        <p>
          <b>Created At:</b>{" "}
          {new Date(bus.createdAt).toLocaleString()}
        </p>
        <p>
          <b>Last Updated:</b>{" "}
          {new Date(bus.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn">View Trips</button>
        <button className="btn">View History</button>
      </div>
    </div>
  );
}
