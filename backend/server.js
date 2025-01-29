const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/mainRoutes'))
app.use('/api/cars', require('./routes/carRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
