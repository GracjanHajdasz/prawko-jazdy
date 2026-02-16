import React, { useState, useEffect } from "react";
import "./Scheduler.css";
import Slot from "./slot/Slot.jsx";
import Confirmation from "./confirmation/Confirmation.jsx";

const fetchMockSlots = async (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!date) return resolve([]);
      resolve([
        { time: "08:00", status: "available" },
        { time: "09:00", status: "available" },
        { time: "10:00", status: "available" },
        { time: "11:00", status: "available" },
        { time: "12:00", status: "available" },
        { time: "13:00", status: "available" },
        { time: "14:00", status: "available" },
        { time: "15:00", status: "available" },
        { time: "16:00", status: "available" },
        { time: "17:00", status: "available" },
        { time: "18:00", status: "available" },
        { time: "19:00", status: "available" },
        { time: "20:00", status: "available" },
      ]);
    }, 800);
  });
};

export default function Scheduler({ setShowPopUp, setPopUpText }) {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Pokaż confirmation gdy są sloty
  useEffect(() => {
    if (selectedSlots.length > 0) {
      setShowConfirmation(true);
    } else {
      // Czekaj na koniec animacji przed ukryciem
      setTimeout(() => setShowConfirmation(false), 300);
    }
  }, [selectedSlots]);

  useEffect(() => {
    if (!date) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setSelectedSlots([]);

    fetchMockSlots(date)
      .then((data) => {
        if (isMounted) setSlots(data);
      })
      .catch(() => {
        if (isMounted) setError("Błąd pobierania danych.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [date]);

  useEffect(() => {
    console.log(selectedSlots);
  }, [selectedSlots]);

  const handleSlotToggle = (time) => {
    setSelectedSlots((prevSlots) => {
      let newSlots;
      if (prevSlots.includes(time)) {
        newSlots = prevSlots.filter((t) => t !== time);
      } else {
        if (prevSlots.length >= 4) {
          setPopUpText("Maksymalnie możesz wybrać 4 godziny w ciągu dnia");
          setShowPopUp(true);
          return prevSlots;
        }
        newSlots = [...prevSlots, time];
      }
      return newSlots.sort((a, b) => a.localeCompare(b));
    });
  };

  return (
    <div className="scheduler-container">
      <header>
        <h2>Harmonogram</h2>
        <label htmlFor="date-picker">Wybierz datę: </label>
        <input
          id="date-picker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </header>
      <main>
        {isLoading && <p>Ładowanie...</p>}
        {error && <p className="error-msg">{error}</p>}
        {!isLoading && !error && (
          <div className="slots-container">
            {slots.map((slot) => {
              if (slot.status !== "available") return null;
              return (
                <Slot
                  key={slot.time}
                  time={slot.time}
                  isSelected={selectedSlots.includes(slot.time)}
                  onSelect={handleSlotToggle}
                />
              );
            })}
          </div>
        )}
      </main>
      {showConfirmation && (
        <Confirmation
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />
      )}
    </div>
  );
}
