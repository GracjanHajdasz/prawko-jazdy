import { useState, useEffect } from "react";
import "./Confirmation.css";

export default function Confirmation({ selectedSlots, setSelectedSlots }) {
  const [isHiding, setIsHiding] = useState(false);
  const [displaySlots, setDisplaySlots] = useState(selectedSlots);

  useEffect(() => {
    if (selectedSlots.length > 0) {
      setDisplaySlots(selectedSlots);
      setIsHiding(false);
    } else if (selectedSlots.length === 0 && !isHiding) {
      setIsHiding(true);
    }
  }, [selectedSlots, isHiding]);

  function cancelSlots() {
    setIsHiding(true);
    setTimeout(() => {
      setSelectedSlots([]);
      setIsHiding(false);
    }, 300);
  }

  if (displaySlots.length === 0 && selectedSlots.length === 0) {
    return null;
  }

  return (
    <div className={`confirmation-container ${isHiding ? "hiding" : ""}`}>
      <p>Wybrane godziny: </p>
      <div className="selected-slots-container">
        {displaySlots.map((selectedSlot) => {
          return <span key={selectedSlot}>{selectedSlot}</span>;
        })}
      </div>
      <div className="btn-container">
        <button onClick={cancelSlots} className="btn cancel-btn">
          Anuluj
        </button>
        <button className="btn">Potwierdź</button>
      </div>
    </div>
  );
}
