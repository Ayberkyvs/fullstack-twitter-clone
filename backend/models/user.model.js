import mongoose from 'mongoose';
import Post from './post.model.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be at least 6 characters long']
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
            default: [],
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
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId, // ref to Post
            ref: 'Post',
            default: []
        }
    ],
    repostedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId, // ref to Post
            ref: 'Post',
            default: [],
            timestamps: true
        }
    ],
}, {timestamps: true});

//! mongoose-hidden plugini password icin eklenebilir.

userSchema.pre('remove', async function (next) {
    try {
        await Post.deleteMany({user: this._id}); // Delete all posts of the user
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);

export default User;