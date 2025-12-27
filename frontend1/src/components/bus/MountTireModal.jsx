import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getBuses,
  getBusTireSlots,
  mountTire,
} from "../../api/busApi";

export default function MountTireModal({ tire, onClose, onDone }) {
  const [buses, setBuses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [busId, setBusId] = useState("");
  const [slotPosition, setSlotPosition] = useState("");
  const [loading, setLoading] = useState(false);

  // Load buses
  useEffect(() => {
    const loadBuses = async () => {
      const res = await getBuses();
      setBuses(res.data);
    };
    loadBuses();
  }, []);

  // Load slots when bus selected
  useEffect(() => {
    if (!busId) return;

    const loadSlots = async () => {
      const res = await getBusTireSlots(busId);
      setSlots(res.data);
    };

    loadSlots();
  }, [busId]);

  const handleMount = async () => {
    if (!busId || !slotPosition) {
      alert("Please select bus and slot");
      return;
    }

    try {
      setLoading(true);

      await mountTire({
        tireId: tire._id,
        busId,
        slotPosition,
      });

      onDone();
    } catch (e) {
      alert(e?.response?.data?.message || "Mount failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-96"
      >
        <h3 className="text-lg font-bold mb-2">
          🛞 Mount Tire
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Tire: <b>{tire.tireCode}</b>
        </p>

        {/* BUS SELECT */}
        <label className="block text-sm font-medium mb-1">
          Select Bus
        </label>
        <select
          value={busId}
          onChange={(e) => {
            setBusId(e.target.value);
            setSlotPosition("");
          }}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">-- Select Bus --</option>
          {buses.map((bus) => (
            <option key={bus._id} value={bus._id}>
              {bus.busNumber}
            </option>
          ))}
        </select>

        {/* SLOT SELECT */}
        <label className="block text-sm font-medium mb-1">
          Select Slot
        </label>
        <select
          value={slotPosition}
          onChange={(e) => setSlotPosition(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select Slot --</option>
          {slots.map((s) => (
            <option
              key={s.slotPosition}
              value={s.slotPosition}
              disabled={!!s.tireId}
            >
              {s.slotPosition}{" "}
              {s.tireId ? "(Occupied)" : "(Empty)"}
            </option>
          ))}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleMount}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Mounting..." : "Mount Tire"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
