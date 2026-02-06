const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if(userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Użytkownik jest już zarejestrowany!'});
        }

        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)', 
            [username, password]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Bład podczas rejestracji!'});
    }
}

exports.login = async( req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE username = $1 and password = $2', 
            [username, password])

        const user = result.rows[0];

        if (result.rows.length > 0) {
            res.json({ message: "Login przebiegło pomyślnie!", user: result.rows[0] });
        } else {
            res.status(401).json({ message: "Nieprawidłowe dane logowania!"});
        }

        // if(!user) {
        //     return res.status(400).json({ message: 'User does not exist!'});
        // }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Bład podczas logowania!'});
    }
}