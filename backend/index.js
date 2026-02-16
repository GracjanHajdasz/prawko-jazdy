require('dotenv').config();
const app = express();
const express = require('express');
const cors = require('cors') 
const authRoutes = require('./routes/auth.routes');

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes); 

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));