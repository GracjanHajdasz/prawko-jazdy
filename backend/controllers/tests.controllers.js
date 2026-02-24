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
