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
  return (
    <div className="scheduler-container">
      <h1>Harmonogram</h1>
    </div>
  );
}
