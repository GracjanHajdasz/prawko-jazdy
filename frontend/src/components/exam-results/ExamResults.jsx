import { useEffect, useRef } from 'react';
import axios from 'axios';
import './ExamResults.css';

export default function ExamResults({ 
  sumaPunktow, 
  punktyPodstawowe, 
  punktySpecjalistyczne, 
  czasEgzaminu,
  odpowiedzi
}) {
  const czyZdany = sumaPunktow >= 68;
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const userId = localStorage.getItem("clientId") || localStorage.getItem("clientid");

    if (!userId || !odpowiedzi || odpowiedzi.length !== 32) return;

    hasSaved.current = true;

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const payload = {
      clientId: userId,
      data_egzaminu: formattedDate,
      uzyskane_punkty: sumaPunktow,
      odpowiedzi: odpowiedzi
    };

    axios.post(
      "http://localhost:5000/api/tests/saveExamResults",
      payload,
      { withCredentials: true }
    )
    .then(response => {
      console.log("Sukces! Odpowiedź serwera:", response.data);
    })
    .catch((error) => {
      console.error("Błąd sieci lub serwera:", error);
      hasSaved.current = false;
    });
  }, [sumaPunktow, odpowiedzi]);

  return (
    <div className="exam-results-container">
      <h1>Wynik egzaminu</h1>
      
      <h2 className={`result-status ${czyZdany ? 'positive' : 'negative'}`}>
        {czyZdany ? "POZYTYWNY" : "NEGATYWNY"}
      </h2>

      <div className="stats-box">
        <p><strong>Zdobyte punkty:</strong> <span>{sumaPunktow} / 74</span></p>
        <p><strong>Część podstawowa:</strong> <span>{punktyPodstawowe}</span></p>
        <p><strong>Część specjalistyczna:</strong> <span>{punktySpecjalistyczne}</span></p>
        <p><strong>Czas trwania egzaminu:</strong> <span>{czasEgzaminu}</span></p>
      </div>

      <button 
        className="btn-end" 
        onClick={() => window.location.href = '/testy'}
      >
        Wróć do menu
      </button>
    </div>
  );
}