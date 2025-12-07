import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

dotenv.config();

// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware for parsing request bodies
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// import routers
import chatRouter from './routes/chat.route';
import uploadRouter from './routes/upload.route';

app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);

export { httpServer, app };
