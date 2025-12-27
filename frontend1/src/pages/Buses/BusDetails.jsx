import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusById, getBusTireSlots } from "../../api/busApi";
import MountTireModal from "./MountTire";
import UnmountTireModal from "./UnmountTireModal";
import BusIsometricSVG from "../../components/bus/BusIsometricSVG";

/* SLOT → POSITION MAP */
const SLOT_TO_POS = {
  "slot-1": "FL",
  "slot-2": "FR",
  "slot-3": "RL",
  "slot-4": "RR",
  "slot-5": "RL2",
  "slot-6": "RR2",
};

/* STATUS → COLOR */
const getTireColor = (tire) => {
  if (!tire) return "#22c55e";          // empty
  if (tire.isExpired) return "#ef4444"; // expired
  if (tire.status === "damaged") return "#f59e0b";
  return "#2563eb";                     // mounted
};

export default function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [dbSlots, setDbSlots] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [mode, setMode] = useState(null);

  const loadData = async () => {
    const [busRes, slotRes] = await Promise.all([
      getBusById(id),
      getBusTireSlots(id),
    ]);

    setBus(busRes.data);
    setDbSlots(slotRes.data);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!bus) return null;

  /* CREATE VIRTUAL SLOTS */
  const allSlots = Array.from({ length: bus.totalSlots }, (_, i) => {
    const slotPosition = `slot-${i + 1}`;
    const mountedSlot = dbSlots.find(
      (s) => s.slotPosition === slotPosition
    );

    return {
      slotPosition,
      mounted: !!mountedSlot,
      data: mountedSlot || null,
    };
  });

  /* BUILD SVG DATA */
  const tireStatusMap = {};
  const tireInfoMap = {};

  allSlots.forEach((slot) => {
    const pos = SLOT_TO_POS[slot.slotPosition];
    if (!pos) return;

    const tire = slot.data?.tireId || null;
    tireStatusMap[pos] = getTireColor(tire);
    tireInfoMap[pos] = tire;
  });

  /* TIRE CLICK HANDLER */
  const handleTireClick = (pos) => {
    const slotKey = Object.keys(SLOT_TO_POS)
      .find((k) => SLOT_TO_POS[k] === pos);

    const slot = allSlots.find(
      (s) => s.slotPosition === slotKey
    );

    if (slot?.mounted) {
      setActiveSlot(slot.data);
      setMode("unmount");
    } else {
      setActiveSlot(slotKey);
      setMode("mount");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-2">
        🚍 Bus {bus.busNumber}
      </h2>

      <button
        onClick={() => navigate(`/history/bus-summary/${bus._id}`)}
        className="mb-6 bg-slate-800 text-white px-4 py-2 rounded-lg"
      >
        View Bus History
      </button>

      <BusIsometricSVG
        bus={bus}
        tireStatusMap={tireStatusMap}
        tireInfoMap={tireInfoMap}
        onBusClick={() => {}}
        onTireClick={handleTireClick}
      />

      {/* MODALS */}
      {mode === "mount" && activeSlot && (
        <MountTireModal
          busId={bus._id}
          slotPosition={activeSlot}
          onClose={() => {
            setMode(null);
            setActiveSlot(null);
          }}
          onDone={() => {
            setMode(null);
            setActiveSlot(null);
            loadData();
          }}
        />
      )}

      {mode === "unmount" && activeSlot && (
        <UnmountTireModal
          slot={activeSlot}
          busId={bus._id}
          onClose={() => {
            setMode(null);
            setActiveSlot(null);
          }}
          onDone={() => {
            setMode(null);
            setActiveSlot(null);
            loadData();
          }}
        />
      )}
    </motion.div>
  );
}
