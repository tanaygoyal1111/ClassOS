import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectDB } from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// ── CORS: Strict origin policy ──────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/v1', documentRoutes);
app.use('/api/v1/groups', groupRoutes);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server]: VedaAI Backend is running on port ${PORT}`);
});
