import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectDB } from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
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
