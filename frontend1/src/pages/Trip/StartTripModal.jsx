import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { startTrip } from "../../api/tripApi";
import { useNavigate } from "react-router-dom";

export default function StartTripModal({ onClose }) {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadBusesWithEligibility = async () => {
      const busRes = await api.get("/buses");
      const buses = busRes.data;

      const enriched = await Promise.all(
        buses.map(async (bus) => {
          const slotRes = await api.get(`/bus-tire-slots/${bus._id}`);
          const slots = slotRes.data;

          // Extract mounted tires
          const mountedTires = slots
            .map((s) => s.tireId)
            .filter(Boolean);

          // If any tire is expired / damaged / zero remaining
          const invalidTire = mountedTires.find(
            (t) =>
              t.isExpired ||
              t.status !== "mounted" ||
              t.remainingKm <= 0
          );

          return {
            ...bus,
            eligible: !invalidTire,
            reason: invalidTire
              ? "Not eligible – tire life exhausted"
              : "Eligible",
          };
        })
      );

      setBuses(enriched);
    };

    loadBusesWithEligibility();
  }, []);

  const handleStart = async () => {
    if (!busId || !totalDistance) return;

    setLoading(true);
    try {
      const res = await startTrip({
        busId,
        totalDistance: Number(totalDistance),
      });
      onClose();
      navigate(`/trips/${res.data._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 12, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-4">Start Trip</h3>

          {/* BUS SELECT */}
          <select
            className="w-full rounded-lg border px-3 py-2 mb-3 text-sm"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
          >
            <option value="">Select Bus</option>

            {buses.map((b) => (
              <option
                key={b._id}
                value={b._id}
                disabled={!b.eligible}
                className={
                  b.eligible
                    ? "text-slate-900"
                    : "text-red-600 font-semibold"
                }
              >
                {b.busNumber} — {b.reason}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Total Distance (km)"
            className="w-full rounded-lg border px-3 py-2 mb-5 text-sm"
            value={totalDistance}
            onChange={(e) => setTotalDistance(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="text-sm">
              Cancel
            </button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!busId || !totalDistance || loading}
              onClick={handleStart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Trip"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
