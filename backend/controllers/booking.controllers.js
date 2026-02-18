const { callPython } = require('../services/pythonService'); 
const { isValid, parseISO } = require('date-fns');

const checkDate = (date) => {
    if (typeof date !== 'string') {
        return false;
    }
    const parsed = parseISO(date);
    return isValid(parsed);
}

exports.editBookings = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: "Brak wymaganych danych rezerwacji" });
        }

        const result = await callPython({
            query_type: "edit_bookings",
            data: data
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z bazy podczas zapisywania rezerwacji");
        }

        res.status(result.status).json({ msg: result.data.msg });
    } catch (error) {
        parseError(error);
    }
};

exports.getBookings = async (req, res) => {
    try {
        const { data } = req.body;

        console.log("--- getBookings REQUEST ---");
        console.log("Payload:", req.body);
        console.log("Data (typ):", typeof data, "| Wartość:", data);

        if (!data) {
            return res.status(400).json({ error: "Brak danych rezerwacji (oczekiwany klucz 'data')" });
        }

        if (!checkDate(data)) {
            return res.status(400).json({ 
                error: "Nieprawidłowy format daty. Oczekiwany format: YYYY-MM-DD (string)",
                received: data 
            });
        }

        const result = await callPython({
            query_type: "fetch_bookings",
            data: data 
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z serwisu Python (baza danych)");
        }

        return res.status(result.status || 200).json(result.data);
        
    } catch (error) {
        console.error("Błąd krytyczny w getBookings:", error);
        
        if (!res.headersSent) {
            return res.status(500).json({ 
                error: "Wystąpił błąd serwera podczas pobierania rezerwacji",
                details: error.message 
            });
        }
    }
};