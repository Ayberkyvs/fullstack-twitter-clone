import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import hashtagRoutes from './routes/hashtag.routes.js';

import { connectDB } from './db/connectDB.js';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({ extended: true }, {limit: '2mb'}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/hashtags", hashtagRoutes);


app.get('/', (req, res) => {
    res.send('Server is ready');
})

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port ' + PORT);
})