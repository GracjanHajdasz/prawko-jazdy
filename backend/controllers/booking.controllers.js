const { callPython, parseError } = require('../services/pythonService'); 
const { isValid, parseISO, parse } = require('date-fns');

const checkDate = (date) => {
    date_formatted = parse(date, 'dd-MM-yyyy', new Date());
    return isValid(parseISO(date_formatted));
}

exports.editBookings = async (req, res) => {
    try {
        const { day, hour, status } = req.body;

        if (!day || !hour || !status) {
            return res.status(400).json({ error: "Brak wymaganych danych rezerwacji" });
        }

        const result = await callPython({
            query_type: "edit_bookings",
            day,
            hour
        });

        if (!result) {
            throw new Error("Brak odpowiedzi z bazy podczas zapisywania rezerwacji");
        }

        res.status(result.status).json({ msg: "Rezerwacja zapisana" });
    } catch (error) {
        parseError(error);
    }
};

//dostaje timestamp, zwraca wszystkie rezerwacje z tego dnia
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

        if (!result) {
            throw new Error("Brak odpowiedzi z bazy podczas pobierania danych");
        }

        res.status(result.status).json(result.data);
        
    } catch (error) {
        parseError(error);
    }
};