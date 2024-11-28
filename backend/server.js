import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser()); // to parse cookies
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready');
})

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port ' + PORT);
})