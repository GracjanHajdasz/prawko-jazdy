import './ExamResults.css';

export default function ExamResults({ 
  sumaPunktow, 
  punktyPodstawowe, 
  punktySpecjalistyczne, 
  czasEgzaminu 
}) {

  const czyZdany = sumaPunktow >= 68;

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