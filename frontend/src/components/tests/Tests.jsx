import { useEffect, useState } from "react";
import axios from "axios";
import "./Tests.css";
import testsIcon from "../../assets/tests.png";
import ExamBlock from "./exam-block/ExamBlock";
import { Link } from "react-router-dom";

export default function Tests() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const userId = localStorage.getItem("clientId") || localStorage.getItem("clientid");

    if (!userId) {
      if (isMounted) {
        setError("Brak autoryzacji. Zaloguj się ponownie.");
        setIsLoading(false);
      }
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/tests/getExamsResults",
        { clientId: userId },
        { withCredentials: true }
      )
      .then((response) => {
        if (isMounted) {
          const examList = response.data.Exams || [];
          
          const formattedExams = examList.map((exam) => ({
            id: exam.id,
            date: exam.data_egzaminu,
            status: exam.liczba_punktow >= 68 ? "passed" : "failed",
          }));

          const sortedData = formattedExams.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setExams(sortedData);
        }
      })
      .catch(() => {
        if (isMounted) setError("Błąd pobierania danych z serwera.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="tests-container">
      <section>
        {isLoading && <p className="slots-loading">Ładowanie wyników...</p>}
        {error && <p className="error">{error}</p>}
        {exams.map((exam) => (
          <ExamBlock
            key={exam.id}
            id={exam.id}
            date={new Date(exam.date).toLocaleString("pl-PL")}
            status={exam.status}
          />
        ))}
      </section>
      <section>
        <img src={testsIcon} alt="tests icon" />
        <h2>Rozpocznij próbny egzamin</h2>
        <Link to="/egzamin" className="btn tests-btn">
          Rozpocznij
        </Link>
      </section>
    </div>
  );
}