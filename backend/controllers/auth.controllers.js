const { callPython } = require('../services/pythonService'); 

exports.register = async (req, res) => {
    try {
        const { clientid, password } = req.body;

        if (!clientid || !password) {
            return res.status(400).json({ 
                error: "Brakuje numeru użytkownika lub hasła" 
            });
        }

        console.log(`Próba rejestracji użytkownika: ${clientid}`);

        const result = await callPython({
            query_type: "register",
            clientid, 
            password 
        });

        if (!result) {
            throw new Error("Brak odpowiedzi podczas rejestracji użytkownika");
        }

        res.status(result.status || 201).json(result.data || { msg: "Użytkownik zarejestrowany" });

    } catch (error) {
        console.error("Błąd podczas próby rejestracji:", error.message);
        
        res.status(500).json({ 
            error: "Wewnętrzny błąd serwera podczas rejestracji",
            details: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { clientid, password } = req.body;
        if (!clientid || !password) {
            return res.status(400).json({ error: "Brakuje numeru użytkownika lub hasła" });
        }

        const result = await callPython({
            query_type: "login",
            clientid, 
            password
        });

        if (!result) {
            throw new Error("Brak odpowiedzi podczas logowania użytkownika");
        }

        res.status(result.status || 200).json(result.data || {});
    } catch (error) {
        console.error("Błąd podczas próby logowania:", error.message);
        res.status(500).json({ 
            error: "Wewnętrzny błąd serwera podczas logowania", 
            details: error.message 
        });
    }
};

exports.getUserData = async (req, res) => {
    const { user } = req.body;
    
    if (!user || !user.id) {
        return res.status(400).json({ error: "Brakuje danych użytkownika" });
    }

    const result = await callPython({
        query_type: "fetch_profile",
        user_id: user.id
    });

    res.status(result.status).json(result.data);
};