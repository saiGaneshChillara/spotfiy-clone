import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.route.js";
import adminRoutes from './routes/admin.route.js';
import authRoutes from "./routes/auth.route.js";
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  connectDB();
})