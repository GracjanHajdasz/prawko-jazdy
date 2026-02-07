const { callPython } = require('../pythonService'); 

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    const result = await callPython({
        query_type: "register",
        username, 
        password 
    });

    res.status(result.status).json(result.data);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    const result = await callPython({
        query_type: "login",
        username, 
        password
    });

    res.status(result.status).json(result.data);
};

exports.getUserData = async (req, res) => {
    const { user } = req.body;
    
    if (!user || !user.id) {
        return res.status(400).json({ error: "Missing User ID"});
    }

    const result = await callPython({
        query_type: "fetch_profile",
        user_id: user.id
    });

    res.status(result.status).json(result.data);
};