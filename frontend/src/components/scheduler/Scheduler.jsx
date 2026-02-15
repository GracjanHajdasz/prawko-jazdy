import React, { useState, useEffect } from "react";
import "./Scheduler.css";
import Slot from "./slot/Slot.jsx";
import Confirmation from "./confirmation/Confirmation.jsx";

const fetchMockSlots = async (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!date) return resolve([]);
      resolve([
        { time: "09:00", status: "booked" },
        { time: "09:30", status: "available" },
        { time: "10:00", status: "available" },
        { time: "10:30", status: "booked" },
        { time: "11:00", status: "available" },
        { time: "11:30", status: "available" },
        { time: "12:00", status: "break" },
        { time: "12:30", status: "available" },
        { time: "13:30", status: "available" },
      ]);
    }, 800);
  });
};

export default function Scheduler() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // ZMIANA 1: Stan jest teraz tablicą
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    // ZMIANA 2: Czyścimy tablicę przy zmianie daty
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

  // ZMIANA 3: Logika dodawania/usuwania z tablicy
  const handleSlotToggle = (time) => {
    setSelectedSlots((prevSlots) => {
      if (prevSlots.includes(time)) {
        // Jeśli już jest -> usuń (zwróć nową tablicę bez tego elementu)
        return prevSlots.filter((t) => t !== time);
      } else {
        // Jeśli nie ma -> dodaj (skopiuj starą tablicę i dodaj nowy element)
        return [...prevSlots, time];
      }
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

        {/* Przekazujemy teraz całą tablicę do potwierdzenia */}
        {selectedSlots.length > 0 && (
          <Confirmation selectedSlots={selectedSlots} />
        )}
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
                  // ZMIANA 4: Sprawdzamy czy tablica zawiera ten czas
                  isSelected={selectedSlots.includes(slot.time)}
                  onSelect={handleSlotToggle}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
