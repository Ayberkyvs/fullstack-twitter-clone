import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be at least 6 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId, // ref to User
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, // ref to User
            ref: 'User',
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    }
}, {timestamps: true});

//! mongoose-hidden plugini password icin eklenebilir.

const User = mongoose.model('User', userSchema);

export default User;