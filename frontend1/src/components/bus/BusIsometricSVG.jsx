import { useState } from "react";

export default function BusIsometricSVG({
  bus,
  tireStatusMap,
  tireInfoMap,
  onBusClick,
  onTireClick,
}) {
  const isSixWheeler = bus.totalSlots === 6;
  const [tooltip, setTooltip] = useState(null);

  const show = (html, e) =>
    setTooltip({ html, x: e.clientX, y: e.clientY });

  const hide = () => setTooltip(null);

  return (
    <div style={{ position: "relative", maxWidth: 600, margin: "auto" }}>
      <svg viewBox="0 0 600 300" width="100%">

        {/* BUS */}
        <rect
          x="150"
          y="80"
          width="300"
          height="140"
          rx="20"
          fill="#e5e7eb"
          stroke="#000"
          strokeWidth="2"
          onMouseOver={(e) => {
            e.stopPropagation();
            show(
              `<b>Bus:</b> ${bus.busNumber}<br/>
               <b>Status:</b> ${bus.status}<br/>
               <b>Slots:</b> ${bus.totalSlots}`,
              e
            );
          }}
          onMouseOut={hide}
          onClick={(e) => {
            e.stopPropagation();
            onBusClick();
          }}
        />

        {/* FRONT */}
        <Tire x={120} y={100} pos="FL" tire={tireInfoMap.FL} color={tireStatusMap.FL} show={show} hide={hide} onClick={onTireClick} />
        <Tire x={450} y={100} pos="FR" tire={tireInfoMap.FR} color={tireStatusMap.FR} show={show} hide={hide} onClick={onTireClick} />

        {/* REAR */}
        {!isSixWheeler && (
          <>
            <Tire x={120} y={200} pos="RL" tire={tireInfoMap.RL} color={tireStatusMap.RL} show={show} hide={hide} onClick={onTireClick} />
            <Tire x={450} y={200} pos="RR" tire={tireInfoMap.RR} color={tireStatusMap.RR} show={show} hide={hide} onClick={onTireClick} />
          </>
        )}

        {isSixWheeler && (
          <>
            <Tire x={110} y={200} pos="RL" tire={tireInfoMap.RL} color={tireStatusMap.RL} show={show} hide={hide} onClick={onTireClick} />
            <Tire x={160} y={200} pos="RL2" tire={tireInfoMap.RL2} color={tireStatusMap.RL2} show={show} hide={hide} onClick={onTireClick} />
            <Tire x={410} y={200} pos="RR2" tire={tireInfoMap.RR2} color={tireStatusMap.RR2} show={show} hide={hide} onClick={onTireClick} />
            <Tire x={460} y={200} pos="RR" tire={tireInfoMap.RR} color={tireStatusMap.RR} show={show} hide={hide} onClick={onTireClick} />
          </>
        )}
      </svg>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            background: "#111",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.html }}
        />
      )}
    </div>
  );
}

/* TIRE */
function Tire({ x, y, pos, tire, color, show, hide, onClick }) {
  return (
    <rect
      x={x}
      y={y}
      width="30"
      height="20"
      rx="6"
      fill={color}
      style={{ cursor: "pointer" }}
      onMouseOver={(e) => {
        e.stopPropagation();
        show(
          tire
            ? `<b>${pos}</b><br/>
               Code: ${tire.tireCode}<br/>
               Status: ${tire.status}<br/>
               Used: ${tire.kmUsed}<br/>
               Remaining: ${tire.remainingKm}`
            : `<b>${pos}</b><br/>Empty Slot`,
          e
        );
      }}
      onMouseOut={(e) => {
        e.stopPropagation();
        hide();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(pos);
      }}
    />
  );
}
