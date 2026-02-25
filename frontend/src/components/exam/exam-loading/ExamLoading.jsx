import "./ExamLoading.css";
import { useEffect, useState, useRef } from "react";

export default function ExamLoading({ setIsLoaded }) {
  function Countdown() {
    const [timeLeft, setTimeLeft] = useState(30);
    const intervalRef = useRef(null);

    useEffect(() => {
      setTimeLeft(30);
    }, [30]);

    useEffect(() => {
      if (timeLeft <= 0) return;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }, [timeLeft]);

    if (timeLeft <= 0) setIsLoaded(true);

    return <span>{timeLeft}</span>;
  }
  return (
    <div className="exam-loading-container">
      <h1>Przygotuj się, egzamin rozpocznie się za: {Countdown()}</h1>
      <h2>Instrukcja dla kursanta</h2>
      <p>
        Za chwilę rozpocznie się próbny egzamin teoretyczny. Przeczytaj uważnie
        poniższe informacje:
      </p>

      <ul>
        <li>Egzamin składa się z pytań jednokrotnego wyboru.</li>
        <li>Na każde pytanie możesz udzielić tylko jednej odpowiedzi.</li>
        <li>
          Po zatwierdzeniu odpowiedzi nie ma możliwości powrotu do poprzedniego
          pytania.
        </li>
        <li>Czytaj pytania dokładnie i zwracaj uwagę na szczegóły.</li>
        <li>
          Czas na udzielenie odpowiedzi jest ograniczony – pilnuj licznika
          czasu.
        </li>
        <li>Nie używaj przycisku „Wstecz” w przeglądarce.</li>
        <li>Wynik zobaczysz po zakończeniu egzaminu.</li>
      </ul>
      <button className="btn" onClick={() => setIsLoaded(true)}>
        Rozpocznij egzamin
      </button>
    </div>
  );
}
