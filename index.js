import express from "express";
import dotenv from "dotenv";
import path from 'path';
import cors from 'cors';

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";


import userRoutes from "./routes/user.route.js";
import adminRoutes from './routes/admin.route.js';
import authRoutes from "./routes/auth.route.js";
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';

import { connectDB } from "./lib/db.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp'),
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}));

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.6:3000", 
  "http://192.168.0.118:3000",
  "http://192.168.73.171:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  connectDB();
})