require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors') 
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes); 
app.use('/api/bookings', bookingRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));