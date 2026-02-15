const { callPython } = require('../services/pythonService'); 
const { isValid, parseISO, parse } = require('date-fns');

const checkDate = (date) => {
    date_formatted = parse(date, 'dd-MM-yyyy', new Date());
    return isValid(parseISO(date_formatted));
}

exports.saveBooking = async (req, res) => {
    try {
        const { day, hour, status } = req.body;

        if (!day || !hour || !status) {
            return res.status(400).json({ error: "Brak wymaganych danych rezerwacji" });
        }

        const result = await callPython({
            query_type: "save_booking",
            day,
            hour
        });

        if (!result) {
            throw new Error("Brak odpowiedzi podczas zapisywania rezerwacji");
        }

        res.status(result.status).json({ msg: "Rezerwacja zapisana" });
    } catch (error) {
        console.error("Błąd podczas próby zapisywania rezerwacji:", error.message);
        res.status(500).json({ 
            error: "Wewnętrzny błąd serwera podczas zapisywania rezerwacji", 
            details: error.message 
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { day, hour, status } = req.body;

        if (!day || !hour || !status) {
            return res.status(400).json({ error: "Brak wymaganych danych do anulowania rezerwacji" });
        }

        const result = await callPython({
            query_type: "cancel_booking",
            day,
            hour
        });

        if (!result) {
            throw new Error("Brak odpowiedzi podczas zapisywania rezerwacji");
        }

        res.status(result.status).json({ msg: "Rezerwacja anulowana" });

    } catch (error) {
        console.error("Błąd podczas próby anulowania rezerwacji:", error.message);
        res.status(500).json({ 
            error: "Wewnętrzny błąd serwera podczas anulowania rezerwacji", 
            details: error.message 
        });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const { day } = req.body;

        if (!day) {
            return res.status(400).json({ error: "Brak danych rezerwacji w wybranym dniu" });
        }

        if (!checkDate(day)) {
            return res.status(400).json({ error: "Nieprawidłowy format daty" });
        }

        const result = await callPython({
            query_type: "fetch_bookings",
            day
        });

        res.status(result.status).json(result.data);
        

    } catch (error) {
        console.error("Błąd podczas próby pobierania rezerwacji:", error.message);
        res.status(500).json({ 
            error: "Wewnętrzny błąd serwera podczas pobierania rezerwacji", 
            details: error.message 
        });
    }
};