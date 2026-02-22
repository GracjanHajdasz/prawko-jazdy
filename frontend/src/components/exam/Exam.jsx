import "./Exam.css";
import placeholder from "../../assets/placeholder.png";
import Timer from "./timer/Timer.jsx";
import { useEffect, useState, useRef } from "react";

export default function Exam() {
  const [examQuestions, setExamQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState();
  const [questionIntroductionTime, setQuestionIntroductionTime] =
    useState(true); //jak czas na zapoznanie sie z pytaniem dojdzie do konca to bedzie true

  async function fetchExamData() {
    try {
      const response = await fetch("http://localhost:5000/api/tests/getExam", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd HTTP! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Pytania podstawowe:", data.podstawowe);
      console.log("Pytania specjalistyczne:", data.specjalistyczne);

      return data;
    } catch (error) {
      console.error("Wystąpił błąd podczas pobierania egzaminu:", error);
    }

    useEffect(() => {
      const loadExam = async () => {
        try {
          const data = await fetchExamData();
          setExamQuestions(data);
        } catch (error) {
          console.error(error);
        }
      };

      loadExam();
    }, []);
  }

  function questionTimer(seconds) {
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

    useEffect(() => {
      if (timeLeft <= 0) {
        setQuestionIntroductionTime((prev) => !prev);
      }
    }, [timeLeft]);

    const format = (secs) => {
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      return [m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };

    if (timeLeft <= 0) return <span>00:00</span>;
    return <span>{format(timeLeft)}</span>;
  }

  function examTimer(seconds) {
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

  return (
    <div className="exam-container">
      <div className="left-panel">
        <div className="top-bar">
          <div className="info-group">
            <div className="label">
              Wartość
              <br />
              punktowa
            </div>
            <div className="badge">2</div>
          </div>
          <div className="info-group">
            <div className="label">
              Aktualna
              <br />
              kategoria
            </div>
            <div className="badge">B</div>
          </div>
          <div className="info-group">
            <div className="label">
              Czas do końca
              <br />
              egzaminu
            </div>
            <div className="badge time" id="exam-time">
              {examTimer(1500)}
            </div>
          </div>
        </div>

        <div className="image-area">
          <img src={placeholder} alt="zdjęcie do pytania" />
        </div>

        <p className="question-text">
          Czy w tej sytuacji, kierując samochodem osobowym,
          <br />
          możesz przejechać na prawy pas ruchu?
        </p>

        <div className="answer-buttons">
          <button className="btn-answer">Tak</button>
          <button className="btn-answer">Nie</button>
        </div>
      </div>

      <div className="right-panel">
        <button className="btn-end">Zakończ egzamin</button>

        <div className="questions-section">
          <div className="q-group">
            <div className="q-label">
              Pytania
              <br />
              podstawowe
            </div>
            <span className="q-badge blue">1 z 20</span>
          </div>
          <div className="q-group">
            <div className="q-label">
              Pytania
              <br />
              specjalistyczne
            </div>
            <span className="q-badge gray">0 z 12</span>
          </div>
        </div>

        <div className="timer-section">
          <div className="t-label">
            Czas na udzielenie
            <br />
            odpowiedzi
          </div>
          <span className="t-value" id="q-timer">
            {questionIntroductionTime ? questionTimer(15) : questionTimer(20)}
          </span>
        </div>

        <button className="btn-next">Następne pytanie</button>
      </div>
    </div>
  );
}
