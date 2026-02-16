import { useEffect, useState } from "react";
import "./Tests.css";
import testsIcon from "../../assets/tests.png";
import ExamBlock from "./exam-block/ExamBlock";

const fetchMockExams = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          date: "2024-01-15T10:00:00",
          status: "passed",
        },
        {
          date: "2024-01-22T14:30:00",
          status: "failed",
        },
        {
          date: "2024-02-05T09:00:00",
          status: "passed",
        },
        {
          date: "2024-02-18T11:15:00",
          status: "passed",
        },
        {
          date: "2024-03-10T15:45:00",
          status: "failed",
        },
        {
          date: "2024-03-24T13:00:00",
          status: "passed",
        },
      ]);
    }, 800);
  });
};

export default function Tests() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchMockExams()
      .then((data) => {
        if (isMounted) {
          const sortedData = data.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          setExams(sortedData);
        }
      })
      .catch(() => {
        if (isMounted) setError("Błąd pobierania danych.");
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
        {isLoading && <p>Ładowanie...</p>}
        {error && <p className="error">{error}</p>}
        {exams.map((exam, index) => (
          <ExamBlock
            key={index}
            date={new Date(exam.date).toLocaleString("pl-PL")}
            status={exam.status}
          />
        ))}
      </section>
      <section>
        <img src={testsIcon} alt="tests icon" />
        <h2>Rozpocznij próbny egzamin</h2>
        <button className="tests-btn">Rozpocznij</button>
      </section>
    </div>
  );
}
