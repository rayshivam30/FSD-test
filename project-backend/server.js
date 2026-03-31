const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require("dotenv").config({ override: true });

const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Trust reverse proxy (Important for Railway/Render)
app.set("trust proxy", 1);

app.use(helmet());

// Split origins and trim whitespace
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Debug log to see incoming origin in Railway logs
    console.log(`CORS Preflight from origin: ${origin || 'No Origin (Server-side)'}`);

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS Policy: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


app.get('/', (req, res) => res.json({ message: 'Server is running', version: '1.0.0' }));


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;