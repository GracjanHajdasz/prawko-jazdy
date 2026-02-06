const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if(userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already registered'});
        }

        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)', 
            [username, password]);

        res.status(201).json({ message: 'User registered successfully'});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error during registration'});
    }
}

exports.login = async( req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE username = $1 and password = $2', 
            [username, password])

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Incorrect username or password"});
        }

        const user = result.rows[0];

        if (result.rows.length > 0) {
            res.json({ message: "User logged in sucessfully", 
            user: { 
                id: user.id, 
                username: user.username 
            }
            });
        } else {
            res.status(401).json({ message: "Incorrect username or password"});
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error during login'});
    }
}