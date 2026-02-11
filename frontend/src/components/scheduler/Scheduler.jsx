import React, { useState, useEffect } from "react";
import "./Scheduler.css";

const fetchMockSlots = (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { time: "09:00", status: "booked" },
        { time: "09:30", status: "available" }, 
        { time: "10:00", status: "available" },
        { time: "10:30", status: "booked" },
        { time: "11:00", status: "available" },
        { time: "11:30", status: "available" },
        { time: "12:00", status: "break" },
        { time: "12:30", status: "available" },
      ]);
    }, 800);
  });
};

export default function Scheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchMockSlots(selectedDate).then((data) => {
      setSlots(data);
      setIsLoading(false);
      setSelectedSlot(null);
    });
  }, [selectedDate]);

  const handleSlotClick = (slot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot.time);
    }
  };

  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      alert(`Rezerwacja potwierdzona na godzinę: ${selectedSlot}`);
      setIsBooking(false);
    }, 1000);
  };

  return (
    <div className="scheduler-container">
      <header className="scheduler-header">
        <h1>Harmonogram Wizyt</h1>
        <p className="subtitle">Wybierz dogodny termin spotkania</p>
        
        {/* Simple Date Picker Simulation */}
        <div className="date-controls">
          <label>Data: </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </div>
      </header>

      <main className="scheduler-content">
        {isLoading ? (
          <div className="loading-state">Ładowanie wolnych terminów...</div>
        ) : (
          <div className="slots-grid">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.status !== "available"}
                  onClick={() => handleSlotClick(slot)}
                  className={`slot-btn status-${slot.status} ${
                    selectedSlot === slot.time ? "selected" : ""
                  }`}
                >
                  {slot.time}
                  {slot.status === "booked" && <span className="status-label">Zajęte</span>}
                </button>
              ))
            ) : (
              <p className="empty-state">Brak wolnych miejsc w tym dniu.</p>
            )}
          </div>
        )}
      </main>

      <footer className="scheduler-footer">
        {selectedSlot ? (
          <div className="booking-summary">
            <span>Wybrano godzinę: <strong>{selectedSlot}</strong></span>
            <button 
              className="confirm-btn" 
              onClick={handleBooking}
              disabled={isBooking}
            >
              {isBooking ? "Przetwarzanie..." : "Potwierdź rezerwację"}
            </button>
          </div>
        ) : (
          <p className="hint-text">Kliknij wolną godzinę, aby zarezerwować.</p>
        )}
      </footer>
    </div>
  );
}