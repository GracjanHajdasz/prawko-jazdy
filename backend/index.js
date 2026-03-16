require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const testsRoutes = require('./routes/tests.routes');
const studentsRoutes = require('./routes/students.routes');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser()); 

app.use('/api/auth', authRoutes); 
app.use('/api/bookings', bookingRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/students', studentsRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));