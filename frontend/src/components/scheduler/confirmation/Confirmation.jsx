import { useState, useEffect } from "react";
import "./Confirmation.css";

export default function Confirmation({ selectedSlots, setSelectedSlots }) {
  const [isHiding, setIsHiding] = useState(false);
  // 1. Tworzymy lokalny stan do wyświetlania, żeby "pamiętał" dane podczas animacji wyjścia
  const [displaySlots, setDisplaySlots] = useState(selectedSlots);

  useEffect(() => {
    // Jeśli są wybrane sloty, aktualizujemy wyświetlanie i resetujemy stan ukrywania
    if (selectedSlots.length > 0) {
      setDisplaySlots(selectedSlots);
      setIsHiding(false);
    }
    // Jeśli sloty zostały wyczyszczone (np. ręcznie odklikane do zera),
    // uruchamiamy animację ukrywania, ALE NIE czyścimy displaySlots,
    // żeby tekst nie zniknął nagle.
    else if (selectedSlots.length === 0 && !isHiding) {
      setIsHiding(true);
    }
  }, [selectedSlots, isHiding]);

  function cancelSlots() {
    setIsHiding(true);
    // Czekamy tyle, ile trwa animacja w CSS (0.3s)
    setTimeout(() => {
      setSelectedSlots([]);
      // Uwaga: Tutaj nie musimy czyścić displaySlots ręcznie,
      // bo przy kolejnym otwarciu nadpiszą się nowymi danymi.
      setIsHiding(false);
    }, 300);
  }

  // Jeśli nie ma nic do wyświetlenia (na starcie), nie renderujemy nic
  // Zapobiega to pokazywaniu pustego paska przy pierwszym ładowaniu
  if (displaySlots.length === 0 && selectedSlots.length === 0) {
    return null;
  }

  return (
    // 2. Renderujemy displaySlots zamiast selectedSlots
    <div className={`confirmation-container ${isHiding ? "hiding" : ""}`}>
      <p>Wybrane godziny: </p>
      <div className="selected-slots-container">
        {displaySlots.map((selectedSlot) => {
          return <span key={selectedSlot}>{selectedSlot}</span>;
        })}
      </div>
      <div className="btn-container">
        <button onClick={cancelSlots} className="cancel-btn">
          Anuluj
        </button>
        <button>Potwierdź</button>
      </div>
    </div>
  );
}
