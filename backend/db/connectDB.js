import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected: ' + conn.connection.host);
    } catch (err) {
        console.error('Error connection to mongoDB; \n' + err);
        process.exit(1);
    }
}