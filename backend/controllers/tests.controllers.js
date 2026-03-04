const { callPython } = require("../services/python.service");

exports.getExam = async (req, res) => {
  try {
    const { data } = req.body || {};

    const result = await callPython({
      query_type: "get_exam",
      data: data || {},
    });

    if (!result) {
      throw new Error(
        "Brak odpowiedzi z serwisu Python (baza danych) podczas pobierania egzaminu",
      );
    }

    return res.status(result.status || 200).json(result.data);
  } catch (error) {
    console.error("Błąd krytyczny w getExam:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Wystąpił błąd serwera podczas pobierania zawartości egzaminu",
        details: error.message,
      });
    }
  }
};

exports.getExamsResults = async (req, res) => {
  try {
    const { clientId } = req.body || {};

    const result = await callPython({
      query_type: "get_exams_results",
      data: { clientId }
    });

    if (!result) {
      throw new Error("Brak odpowiedzi z serwisu Python podczas pobierania wyników");
    }

    return res.status(result.status || 200).json(result.data);
  } catch (error) {
    console.error("Błąd krytyczny w getExamsResults:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Wystąpił błąd serwera podczas pobierania wyników egzaminów",
        details: error.message,
      });
    }
  }
};

exports.saveExamResults = async (req, res) => {
  try {
    const { clientId, data_egzaminu, uzyskane_punkty, odpowiedzi } = req.body || {};

    const result = await callPython({
      query_type: "save_exam_results",
      data: { clientId, data_egzaminu, uzyskane_punkty, odpowiedzi }
    });

    if (!result) {
      throw new Error("Brak odpowiedzi z serwisu Python podczas zapisywania wyników");
    }

    return res.status(result.status || 200).json(result.data);
  } catch (error) {
    console.error("Błąd krytyczny w saveExamResults:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Wystąpił błąd serwera podczas zapisywania wyników egzaminu",
        details: error.message,
      });
    }
  }
};

exports.getExamQuestions = async (req, res) => {
  try {
    const { id } = req.body || {};

    const result = await callPython({
      query_type: "get_exam_questions",
      data: { id }
    });

    if (!result) {
      throw new Error("Brak odpowiedzi z serwisu Python podczas pobierania pytań z egzaminu");
    }

    return res.status(result.status || 200).json(result.data);
  } catch (error) {
    console.error("Błąd krytyczny w getExamQuestions:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Wystąpił błąd serwera podczas pobierania pytań z egzaminu",
        details: error.message,
      });
    }
  }
};