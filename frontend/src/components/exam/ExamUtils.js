export const formatTime = (secs) => {
  if (secs < 0) return "00:00";
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

export const calculateScore = (questions, answers) => {
  let podstawowe = 0;
  let specjalistyczne = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.poprawna_odp) {
      if (i < 20) podstawowe += q.liczba_punktów;
      else specjalistyczne += q.liczba_punktów;
    }
  });
  return { podstawowe, specjalistyczne, suma: podstawowe + specjalistyczne };
};