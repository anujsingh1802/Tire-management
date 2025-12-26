import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { startTrip } from "../../api/tripApi";
import { useNavigate } from "react-router-dom";

/* ===== Motion Variants (Premium, Subtle) ===== */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeInOut" },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1], // industry cubic-bezier
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeInOut" },
  },
};

export default function StartTripModal({ onClose }) {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/buses").then((res) => setBuses(res.data));
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
      {/* ===== Backdrop ===== */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      >
        {/* ===== Modal ===== */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          {/* Header */}
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Start Trip
            </h3>
            <p className="text-sm text-slate-500">
              Select a bus and planned distance
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
            >
              <option value="">Select Bus</option>
              {buses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.busNumber}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Total Distance (km)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={totalDistance}
              onChange={(e) => setTotalDistance(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
              disabled={loading || !busId || !totalDistance}
              onClick={handleStart}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Trip"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
