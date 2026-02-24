require('dotenv').config();
const axios = require('axios');

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
        let endpoint = "";
        let dataToSend = {};
        
        if (payload.query_type === "register") {
            endpoint = "/register";
            dataToSend = { 
                clientid: payload.clientid, 
                password: payload.password 
            };
        } 
        else if (payload.query_type === "login") {
            endpoint = "/login";
            dataToSend = { 
                clientid: payload.clientid, 
                password: payload.password 
            };
        }
        else if (payload.query_type === "fetch_profile") {
            endpoint = "/get-profile"; 
            dataToSend = { clientid: payload.clientid };
        }
        else if (payload.query_type === "fetch_bookings") {
            endpoint = "/getBookings"; 
            dataToSend = { data: payload.data };
        }
        else if (payload.query_type === "edit_bookings") {
            endpoint = "/editBookings"; 
            dataToSend = { data: payload.data };
        }
        else if (payload.query_type === "get_exam") {
            endpoint = "/getExam"; 
            dataToSend = { data: payload.data };
        }
        
        const response = await axios.post(`${process.env.PYTHON_SERVICE_URL}${endpoint}`, dataToSend, {
            timeout: 5000,
            headers: {
                'x-internal-secret': process.env.API_SECRET 
            }
        });

        return { status: 200, data: response.data };

    } catch (error) {
        if (error.response) {
            return { status: error.response.status, data: error.response.data };
        } else if (error.code === 'ECONNREFUSED') {
            return { status: 503, data: { error: "Python service is offline" } };
        }
        return { status: 500, data: { error: "Internal node error: " + error.message } };
    }
};