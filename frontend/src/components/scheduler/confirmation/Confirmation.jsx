import { useState, useEffect } from "react";
import "./Confirmation.css";

export default function Confirmation({ selectedSlots, setSelectedSlots, onClick }) {
  const [displaySlots, setDisplaySlots] = useState(selectedSlots);

  useEffect(() => {
    if (selectedSlots.length > 0) {
      setDisplaySlots(selectedSlots);
    }
  }, [selectedSlots]);

  const isHiding = selectedSlots.length === 0;

  if (displaySlots.length === 0 && selectedSlots.length === 0) {
    return null;
  }

  return (
    <div className={`confirmation-container ${isHiding ? "hiding" : ""}`}>
      <p>Wybrane godziny: </p>
      <div className="selected-slots-container">
        {displaySlots.map((selectedSlot) => (
          <span key={selectedSlot}>{selectedSlot}</span>
        ))}
      </div>
      <div className="btn-container">
        <button 
          type="button"
          onClick={() => setSelectedSlots([])} 
          className="btn cancel-btn"
          disabled={isHiding}
        >
          Anuluj
        </button>
        <button 
          type="button"
          onClick={onClick} 
          className="btn"
          disabled={isHiding}
        >
          Potwierdź
        </button>
      </div>
    </div>
  );
}