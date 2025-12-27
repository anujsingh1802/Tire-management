import { useState } from "react";
import { motion } from "framer-motion";
import { repairTire } from "../../api/tireApi";

export default function RepairTireModal({ tire, onClose, onRepaired }) {
  const [type, setType] = useState("minor");
  const [newCode, setNewCode] = useState("");
  const [maxLifeKm, setMaxLifeKm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRepair = async () => {
    try {
      setLoading(true);

      const payload =
        type === "minor"
          ? { type: "minor" }
          : {
              type: "retread",
              newTireCode: newCode,
              maxLifeKm: Number(maxLifeKm),
            };

      await repairTire(tire._id, payload);
      onRepaired();
    } catch (e) {
      alert(e.response?.data?.message || "Repair failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-bold mb-3">
          Repair Tire {tire.tireCode}
        </h3>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="minor">Minor Repair (same tire)</option>
          <option value="retread">Retread (new tire)</option>
        </select>

        {type === "retread" && (
          <>
            <input
              placeholder="New Tire Code"
              className="w-full border p-2 rounded mb-2"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Life Km"
              className="w-full border p-2 rounded mb-3"
              value={maxLifeKm}
              onChange={(e) => setMaxLifeKm(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleRepair}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Repair"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
