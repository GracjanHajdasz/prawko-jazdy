import './ExamResults.css';

export default function ExamResults({ 
  sumaPunktow, 
  punktyPodstawowe, 
  punktySpecjalistyczne, 
  czasEgzaminu 
}) {

  const czyZdany = sumaPunktow >= 68;

  return (
    <div className="exam-results-container" style={{ textAlign: "center", padding: "40px" }}>
      <h1>Wynik egzaminu</h1>
      
      <h2 style={{ color: czyZdany ? "green" : "red", fontSize: "32px" }}>
        {czyZdany ? "POZYTYWNY" : "NEGATYWNY"}
      </h2>

      <div className="stats-box" style={{ marginTop: "20px", fontSize: "18px" }}>
        <p><strong>Zdobyte punkty:</strong> {sumaPunktow} / 74</p>
        <p><strong>Część podstawowa:</strong> {punktyPodstawowe}</p>
        <p><strong>Część specjalistyczna:</strong> {punktySpecjalistyczne}</p>
        <p><strong>Czas trwania egzaminu:</strong> {czasEgzaminu}</p>
      </div>

      <button 
        className="btn-end" 
        style={{ marginTop: "30px" }}
        onClick={() => window.location.href = '/testy'}
      >
        Wróć do menu
      </button>
    </div>
  );
}