import { useState, useEffect, useRef } from "react";

// seconds - liczba sekund do odliczenia
export default function Countdown({ seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  const format = (secs) => {
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  if (timeLeft <= 0) return <span>00:00</span>;
  return <span>{format(timeLeft)}</span>;
}
