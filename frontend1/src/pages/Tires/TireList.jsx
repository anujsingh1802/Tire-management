import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTires } from "../../api/tireApi";
import TireCard from "./TireCard";
import AddTireModal from "./AddTireModal";
import RepairTireModal from "./RepairTireModal";
import MountTireModal from "../../components/bus/MountTireModal";

export default function TireList() {
  const [tires, setTires] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [repairTire, setRepairTire] = useState(null);
  const [mountTire, setMountTire] = useState(null);

  const loadTires = async () => {
    const res = await getTires();
    setTires(res.data);
  };

  useEffect(() => {
    loadTires();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold">Tires</h2>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          + Add Tire
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tires.map((tire) => (
          <TireCard
            key={tire._id}
            tire={tire}
            onRepair={(t) => setRepairTire(t)}
            onMount={(t) => setMountTire(t)}
          />
        ))}
      </div>

      {/* ADD TIRE */}
      {showAdd && (
        <AddTireModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadTires();
          }}
        />
      )}

      {/* REPAIR MODAL */}
      {repairTire && (
        <RepairTireModal
          tire={repairTire}
          onClose={() => setRepairTire(null)}
          onRepaired={() => {
            setRepairTire(null);
            loadTires();
          }}
        />
      )}

      {/* MOUNT MODAL */}
      {mountTire && (
        <MountTireModal
          tire={mountTire}
          onClose={() => setMountTire(null)}
          onDone={() => {
            setMountTire(null);
            loadTires();
          }}
        />
      )}
    </motion.div>
  );
}
