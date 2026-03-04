require('dotenv').config();
const axios = require('axios');

const pythonApi = axios.create({
    baseURL: process.env.PYTHON_SERVICE_URL,
    timeout: 5000,
    headers: {
        'x-api-key': process.env.API_KEY 
    }
});

pythonApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 503 && !originalRequest._retry) {
            originalRequest._retry = true;
            return pythonApi(originalRequest);
        }

        return Promise.reject(error);
    }
);

const endpoints = {
    "register": "/register",
    "login": "/login",
    "fetch_profile": "/get-user-data",
    "fetch_bookings": "/getBookings",
    "edit_bookings": "/editBookings",
    "get_exam": "/getExam"
};

exports.parseError = (error) => {
    if (error.code === 'ECONNREFUSED') {
        console.error("Python service is not running..");
        return { status: 503, data: { error: "Service temporarily unavailable." } };
    }

    if (error.response) {
        const responseData = error.response.data;
        const responseStatus = error.response.status;

        console.error("Response from Python service:", responseData);

        if (responseData && responseData.msg === "Zalogowano pomyślnie") {
            return { status: 200, data: responseData };
        }

        return { status: responseStatus, data: responseData };
    }

    console.error("Internal error:", error.message);
    return { status: 500, data: { error: "Internal server error." } };
}

exports.callPython = async (payload) => {
    try {
        const endpoint = endpoints[payload.query_type];
        
        const { query_type, ...dataToSend } = payload;

        const response = await pythonApi.post(endpoint, dataToSend);

        return { status: 200, data: response.data };

    } catch (error) {
        if (error.response) {
            console.log(JSON.stringify(error.response.data, null, 2));
            return { status: error.response.status, data: error.response.data };
        } else if (error.code === 'ECONNREFUSED') {
            return { status: 503, data: { error: "Python service is offline" } };
        }
        return { status: 500, data: { error: "Internal node error: " + error.message } };
    }
};