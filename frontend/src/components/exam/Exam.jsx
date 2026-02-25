import "./Exam.css";
import ExamResults from "../exam-results/ExamResults";
import ExamLeftPanel from "./ExamLeftPanel";
import ExamRightPanel from "./ExamRightPanel";
import ExamLoading from "./exam-loading/ExamLoading.jsx";
import { useExam } from "./UseExam";
import { formatTime, calculateScore } from "./ExamUtils";
import { useState } from "react";

export default function Exam() {
  const [isLoaded, setIsLoaded] = useState(false); //do loading screena
  const examState = useExam();
  const { loading, questions, isExamFinished, answers, examTimeLeft } =
    examState;

  //if (loading || questions.length === 0) return <div>Ładowanie...</div>;

  if (isExamFinished) {
    const results = calculateScore(questions, answers);
    const czasEgzaminuSekundy = 1500 - examTimeLeft;

    return (
      <ExamResults
        sumaPunktow={results.suma}
        punktyPodstawowe={results.podstawowe}
        punktySpecjalistyczne={results.specjalistyczne}
        czasEgzaminu={formatTime(czasEgzaminuSekundy)}
      />
    );
  }

  return isLoaded ? (
    <div className="exam-container">
      <ExamLeftPanel examState={examState} />
      <ExamRightPanel examState={examState} />
    </div>
  ) : (
    <ExamLoading setIsLoaded={setIsLoaded} />
  );
}
