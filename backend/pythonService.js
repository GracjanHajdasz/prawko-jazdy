const axios = require('axios');
const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const API_SECRET = process.env.INTERNAL_API_KEY || 'haslo';

function parseError(error) {
    if (error.code === 'ECONNREFUSED') {
        console.error("Python service is not running..");
        return { status: 503, data: { error: "Service temporarily unavailable." } };
    }
    if (error.response) {
        console.error("Error from Python service:", error.response.data);
        return { status: error.response.status, data: error.response.data };
    }
    console.error("Internal error:", error.message);
    return { status: 500, data: { error: "Internal server error." } };
}

exports.callPython = async (payload) => {
    try {
        const response = await axios.post(`${PYTHON_URL}/db-operation`, 
            payload, 
            {
                timeout: 5000,
                headers: { 'x-internal-secret': API_SECRET }
            }
        );
        
        return { status: 200, data: response.data }; 
    } catch (error) {
        return parseError(error);
    }
};