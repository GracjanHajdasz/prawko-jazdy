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
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!date) return;

    fetchMockSlots(date).then((data) => {
      setSlots(data);
    });
  }, [date]);

  return (
    <div className="scheduler-container">
      <header>
        <h2>Harmonogram</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </header>
      <main>
        {slots.length === 0 ? (
          <p>Brak wolnych godzin w tym dniu</p>
        ) : (
          <div className="slots-container">
            {slots.map((slot) => (
              slot.status === "available" && (
                <div key={slot.time} className="slot">
                  {slot.time}
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
