require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes'); 

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));