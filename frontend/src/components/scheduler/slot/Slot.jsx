import React from "react";
import "./Slot.css";

const Slot = React.memo(({ time, isSelected, onSelect, disabled }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(time)}
      disabled={disabled}
      className={`slot ${isSelected ? "active" : ""}`}
      aria-pressed={isSelected}
    >
      {time}
    </button>
  );
});

export default Slot;
