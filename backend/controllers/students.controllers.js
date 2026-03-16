const { callPython } = require('../services/python.service');

exports.addNewStudent = async (req, res) => {
    try {
        const data = req.body;

        if (!data.pkk || !data.pesel || !data.imie || !data.nazwisko || !data.rola || data.mail === undefined) {
            return res.status(400).json({ error: "Brak wymaganych danych ucznia" });
        }

        const result = await callPython({
            query_type: "addNewStudent",
            data: data
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w addNewStudent:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};

exports.displayStudents = async (req, res) => {
    try {
        const { od } = req.body;

        if (!od) {
            return res.status(400).json({ error: "Brak parametru 'od' (strona)" });
        }

        const result = await callPython({
            query_type: "displayStudents",
            data: { od: od }
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w displayStudents:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};

exports.editStudent = async (req, res) => {
    try {
        const data = req.body;

        if (!data.clientid || !data.Rola || !data.imie || !data.nazwisko || !data.pesel) {
            return res.status(400).json({ error: "Brak wymaganych danych do edycji" });
        }

        const result = await callPython({
            query_type: "editStudent",
            data: data
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w editStudent:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};

exports.generateNewCode = async (req, res) => {
    try {
        const { clientid } = req.body;

        if (!clientid) {
            return res.status(400).json({ error: "Brak wymaganych danych (clientid)" });
        }

        const result = await callPython({
            query_type: "generateNewCode",
            data: { clientid: clientid }
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w generateNewCode:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};

exports.getStudentsLessons = async (req, res) => {
    try {
        const { clientid } = req.body;

        if (!clientid) {
            return res.status(400).json({ error: "Brak wymaganych danych (clientid)" });
        }

        const result = await callPython({
            query_type: "getStudentsLessons",
            data: { clientid: clientid }
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w getStudentsLessons:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};

exports.newInvoice = async (req, res) => {
    try {
        const data = req.body;

        if (!data.clientid || !data.liczba_godzin || !data.kwota_za_h) {
            return res.status(400).json({ error: "Brak wymaganych danych do faktury" });
        }

        const result = await callPython({
            query_type: "newInvoice",
            data: data
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python");
        }

        res.status(result.status || 200).json(result.data);

    } catch (error) {
        console.error("Błąd krytyczny w newInvoice:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Wystąpił błąd serwera", details: error.message });
        }
    }
};