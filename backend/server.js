import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready');
})

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port ' + PORT);
})