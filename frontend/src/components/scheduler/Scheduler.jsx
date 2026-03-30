import React, { useState, useEffect } from "react";
import "./Scheduler.css";
import Slot from "./slot/Slot.jsx";
import Confirmation from "./confirmation/Confirmation.jsx";

export default function Scheduler({ triggerPopUp }) {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const clientid = localStorage.getItem("clientid");

  useEffect(() => {
    console.log(date);
  }, [date]);

  const fetchSlots = React.useCallback(async () => {
    if (!date) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/getBookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ data: date, clientid: clientid }),
        },
      );

      if (!response.ok) {
        throw new Error("Błąd połączenia z serwerem lub brak uprawnień");
      }

      const result = await response.json();
      const rawData = Array.isArray(result)
        ? result
        : result.Msg || result.data || [];

      const processedSlots = rawData
        .map((item) => {
          const timeOnly = item.data.split(" ")[1].substring(0, 5);
          return {
            time: timeOnly,
            status: item.status,
            fullDate: item.data,
          };
        })
        .sort((a, b) => a.time.localeCompare(b.time));

      setSlots(processedSlots);
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać harmonogramu. Zaloguj się ponownie.");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    setSelectedSlots([]);
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    let timer;
    if (selectedSlots.length > 0) {
      setShowConfirmation(true);
    } else {
      timer = setTimeout(() => setShowConfirmation(false), 300);
    }
    return () => clearTimeout(timer);
  }, [selectedSlots]);

  const handleSlotToggle = (time) => {
    setSelectedSlots((prevSlots) => {
      let newSlots;
      if (prevSlots.includes(time)) {
        newSlots = prevSlots.filter((t) => t !== time);
      } else {
        if (prevSlots.length >= 4) {
          triggerPopUp("Maksymalnie możesz wybrać 4 godziny w ciągu dnia");
          return prevSlots;
        }
        newSlots = [...prevSlots, time];
      }
      return newSlots.sort((a, b) => a.localeCompare(b));
    });
  };

  const handleBooking = async () => {
    const formattedData = selectedSlots.map((time) => `${date} ${time}:00`);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/editBookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ data: formattedData, clientid: clientid }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Błąd podczas zapisywania rezerwacji");
      }

      setSelectedSlots([]);
      triggerPopUp(result.msg || "Rezerwacja zakończona sukcesem");

      setTimeout(() => {
        fetchSlots();
      }, 300);
    } catch (error) {
      console.error(error);
      triggerPopUp(error.message || "Wystąpił błąd podczas rezerwacji.");
    }
  };

  return (
    <div className="scheduler-container">
      <header>
        <h2>Harmonogram</h2>
        <label htmlFor="date-picker">Wybierz datę: </label>
        <input
          className="stylized-input"
          id="date-picker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </header>
      <main>
        {isLoading && (
          <p className="slots-loading">Ładowanie dostępnych godzin...</p>
        )}
        {error && <p className="error-msg">{error}</p>}
        {!isLoading && !error && (
          <div className="slots-container">
            {slots.length > 0 ? (
              slots.map((slot) => {
                if (slot.status !== "available") return null;
                return (
                  <Slot
                    key={slot.time}
                    time={slot.time}
                    isSelected={selectedSlots.includes(slot.time)}
                    onSelect={handleSlotToggle}
                  />
                );
              })
            ) : (
              <p>Brak dostępnych godzin w wybranym dniu.</p>
            )}
          </div>
        )}
      </main>
      {showConfirmation && (
        <Confirmation
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
          onClick={handleBooking}
        />
      )}
    </div>
  );
}
