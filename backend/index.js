require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const authRoutes = require('./routes/routes');

app.use(express.json());
app.use('/api/auth', authRoutes);

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 5000;
const API_SECRET = process.env.INTERNAL_API_KEY || 'haslo';

async function callPython(payload) {
    return await axios.post(`${PYTHON_URL}/db-operation`, 
        payload, 
        {
            timeout: 5000,
            headers: { 'x-internal-secret': API_SECRET }
        }
    );
}

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        const response = await callPython({
            query_type: "register",
            username: username,
            password: password 
        });

        res.json({
            success: true,
            message: "User registered successfully",
            data: response.data
        });

    } catch (error) {
        handleError(error, res);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        const response = await callPython({
            query_type: "login",
            username: username,
            password: password
        });

        res.json({
            success: true,
            message: "User logged in successfully",
            user_data: response.data
        });

    } catch (error) {
        handleError(error, res);
    }
});

app.post('/api/get-user-data', async (req, res) => {
    try {
        const { user } = req.body;

        if (!user.id) {
            return res.status(400).json({ error: "Missing User ID"});
        }
        
        const response = await axios.post(`${PYTHON_URL}/db-operation`, 
            {
            user_id: user.id,
            query_type: "fetch_profile"
            }, 
            {
                timeout: 5000,
                headers: {
                    'x-intternal-secret': API_SECRET
                }
            }
        );

        const finalData = response.data;

        res.json({
            message: "Data retrieved successfully",
            success: true,
            data: finalData
        });

    } catch (error) {
        handleError(error, res);
    }
});

function handleError(error, res) {
    if (error.code === 'ECONNREFUSED') {
        console.error("Python service is not running..");
        return res.status(503).json({ error: "Service temporarily unavailable." });
    }

    if (error.response) {
        console.error("Error from Python service:", error.response.data);
        return res.status(error.response.status).json(error.response.data);
    }

    console.error("Internal error:", error.message);
    res.status(500).json({ error: "Internal server error." });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));