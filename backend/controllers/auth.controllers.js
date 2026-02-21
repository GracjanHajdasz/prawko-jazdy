const { callPython, parseError } = require('../services/python.service'); 
const { generateToken } = require('../services/token.service');

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
      throw new Error("Brak prawidłowej odpowiedzi z bazy podczas rejestracji użytkownika");
    }

    res.status(201).json({ msg: "Użytkownik zarejestrowany" });

  } catch (error) {
    const handledError = parseError(error);
    res.status(handledError.status).json(handledError.data);
  }
};

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

    if (!result || !result.data || !result.data.Msg) {
      throw new Error("Brak prawidłowej odpowiedzi z bazy podczas logowania");
    }

    if (result.data.Msg !== 'Logowanie pomyślne') {
      return res
        .status(401)
        .json({ error: result.data.Msg });
    }

    const payload = { clientid: clientid };
    const accessToken = generateToken(payload, '7d');

    res.cookie('authToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ 
        msg: "Zalogowano pomyślnie"
    });

  } catch (error) {
    const handledError = parseError(error);
    res.status(handledError.status || 500).json(handledError.data || { error: "Błąd serwera" });
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
            throw new Error("Brak prawidłowejodpowiedzi z bazy podczas pobierania danych użytkownika");
        }

    res.status(result.status).json(result.data);
};