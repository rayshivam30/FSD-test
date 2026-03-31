const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');

const app = express();

// Core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Server is running' }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));