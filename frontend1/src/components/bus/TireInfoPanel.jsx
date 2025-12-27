export default function TireInfoPanel({ position }) {
  if (!position) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-3">🛞 Tire Information</h3>

      <p><b>Position:</b> {position}</p>
      <p><b>Status:</b> Mounted</p>
      <p><b>Used KM:</b> --</p>
      <p><b>Remaining Life:</b> --</p>

      <div className="mt-4 flex gap-2">
        <button className="btn">Unmount</button>
        <button className="btn">Repair</button>
        <button className="btn">Replace</button>
      </div>
    </div>
  );
}
