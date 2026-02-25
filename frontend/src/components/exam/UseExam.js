import { useState, useEffect, useCallback } from "react";
import { useBlocker } from "react-router-dom";

export function useExam() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExamFinished, setIsExamFinished] = useState(false);
  
  const [examTimeLeft, setExamTimeLeft] = useState(1500); 
  const [questionTimeLeft, setQuestionTimeLeft] = useState(20);
  const [questionPhase, setQuestionPhase] = useState("reading");

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isExamFinished && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const proceed = window.confirm("Wyjście z egzaminu spowoduje utratę postępu. Czy na pewno?");
      if (proceed) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    const handleUnload = (e) => {
      if (!isExamFinished) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [isExamFinished]);

  const handleFinishExam = useCallback(() => setIsExamFinished(true), []);

  const finishMedia = useCallback(() => {
    setQuestionPhase("answering");
    setQuestionTimeLeft(15);
  }, []);

  const startMedia = useCallback(() => {
    const currentQ = questions[currentIndex];
    const isVideo = currentQ?.media?.toLowerCase().endsWith(".mp4");
    
    if (isVideo) {
      setQuestionPhase("playing");
    } else {
      finishMedia();
    }
  }, [questions, currentIndex, finishMedia]);

  const goToNextQuestion = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        const next = prev + 1;
        const isBasic = next < 20;
        setQuestionPhase(isBasic ? "reading" : "answering");
        setQuestionTimeLeft(isBasic ? 20 : 50);
        return next;
      }
      handleFinishExam();
      return prev;
    });
  }, [questions.length, handleFinishExam]);

  const handleAnswer = (val) => setAnswers(prev => ({ ...prev, [currentIndex]: val }));

  useEffect(() => {
    fetch("http://localhost:5000/api/tests/getExam", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setQuestions([...data.podstawowe, ...data.specjalistyczne]);
        setLoading(false);
        setQuestionPhase("reading");
        setQuestionTimeLeft(20);
      });
  }, []);

  useEffect(() => {
    if (loading || isExamFinished) return;
    const itv = setInterval(() => setExamTimeLeft(p => p - 1), 1000);
    return () => clearInterval(itv);
  }, [loading, isExamFinished]);

  useEffect(() => {
    if (loading || isExamFinished || questionPhase === "playing") return;
    const itv = setInterval(() => setQuestionTimeLeft(p => p - 1), 1000);
    return () => clearInterval(itv);
  }, [loading, isExamFinished, questionPhase]);

  useEffect(() => {
    if (questionTimeLeft <= 0 && !loading && !isExamFinished) {
      if (questionPhase === "reading") {
        startMedia();
      } else if (questionPhase === "answering") {
        goToNextQuestion();
      }
    }
  }, [questionTimeLeft, questionPhase, startMedia, goToNextQuestion, loading, isExamFinished]);

  return { 
    questions, 
    currentIndex, 
    answers, 
    loading, 
    isExamFinished, 
    examTimeLeft, 
    questionTimeLeft, 
    questionPhase, 
    handleFinishExam, 
    goToNextQuestion, 
    startMedia,
    finishMedia,
    handleAnswer 
  };
}