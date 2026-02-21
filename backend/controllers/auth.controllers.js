const { callPython, parseError } = require('../services/python.service'); 

exports.register = async (req, res) => {
  try {
    const { clientid, password } = req.body;

    if (!clientid || !password) {
      return res.status(400).json({
        error: "Brak numeru użytkownika lub hasła",
      });
    }

    console.log(`Próba rejestracji użytkownika: ${clientid}`);

    const result = await callPython({
      query_type: "register",
      clientid,
      password,
    });

    if (!result) {
      throw new Error("Brak odpowiedzi z bazy podczas rejestracji użytkownika");
    }

    res.status(201).json({ msg: "Użytkownik zarejestrowany" });

  } catch (error) {
    const handledError = parseError(error);
    res.status(handledError.status).json(handledError.data);
  }
};

const { generateToken } = require('../services/token.service');

exports.login = async (req, res) => {
  try {
    const { clientid, password } = req.body;
    
    if (!clientid || !password) {
      return res
        .status(400)
        .json({ error: "Brak numeru użytkownika lub hasła" });
    }

    const result = await callPython({
      query_type: "login",
      clientid,
      password,
    });

    if (!result) {
      throw new Error("Brak odpowiedzi z bazy podczas logowania użytkownika");
    }

    const payload = { 
        clientid: clientid,
    };

    const accessToken = generateToken(payload, '7d');

    res.status(200).json({ 
        msg: "Zalogowano pomyślnie",
        token: accessToken
    });

  } catch (error) {
    const handledError = parseError(error);
    res.status(handledError.status).json(handledError.data);
  }
};

exports.getUserData = async (req, res) => {
    const { user } = req.body;
    
    if (!user || !user.id) {
        return res.status(400).json({ error: "Brak danych użytkownika" });
    }

    const result = await callPython({
        query_type: "fetch_profile",
        clientid: user.clientid
    });

    if (!result) {
            throw new Error("Brak odpowiedzi z bazy podczas pobierania danych użytkownika");
        }

    res.status(result.status).json(result.data);
};