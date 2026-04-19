import "./ExamLoading.css";
import { useEffect, useState, useRef } from "react";

export default function ExamLoading({ setIsLoaded }) {
  /*function Countdown() {
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
  }*/
  return (
    <div className="exam-loading-container">
      <div className="exam-loading-header">
        <h4 className="text-h4">Za chwilę rozpoczniesz egzamin próbny</h4>
        <p className="text-body-sm">
          Zapoznaj się z poniższymi informacjami przed startem.
        </p>
      </div>

      <div className="exam-loading-content">
        <p className="text-body-lg">Kilka wskazówek przed startem:</p>
        <ul>
          <li className="text-body">
            Tylko jedna szansa: Na każde pytanie możesz udzielić wyłącznie
            jednej odpowiedzi.
          </li>
          <li className="text-body">
            Idź do przodu: Po zatwierdzeniu odpowiedzi nie będziesz mógł wrócić
            do poprzedniego pytania.
          </li>
          <li className="text-body">
            Czas ma znaczenie: Masz ograniczony czas na każde pytanie –
            kontroluj licznik, aby nic Cię nie zaskoczyło.
          </li>
          <li className="text-body">
            Bądź uważny: Czytaj treść pytań dokładnie; czasem jeden szczegół na
            zdjęciu lub filmie zmienia wszystko.
          </li>
          <li className="text-body">
            Zostań w oknie: Nie używaj przycisku „Wstecz" w przeglądarce, aby
            nie przerwać sesji egzaminacyjnej.
          </li>
          <li className="text-body">
            Twój wynik: Pełne podsumowanie i statystyki zobaczysz od razu po
            zakończeniu całego egzaminu.
          </li>
        </ul>
      </div>

      <div className="exam-loading-container-checkbox-form">
        <input type="checkbox" />
        <p>Nie pokazuj tego okna w przyszłości</p>
      </div>

      <div className="exam-loading-container-buttons">
        <button className="button" onClick={() => setIsLoaded(true)}>
          Rozpocznij egzamin
        </button>
      </div>
    </div>
  );
}
