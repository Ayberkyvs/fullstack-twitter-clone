import mongoose from 'mongoose';
import Hashtag from './hashtag.model.js';

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const POST_TYPES = ['original', 'retweet', 'reply'];


const postSchema = new mongoose.Schema(
    {
      // User who created the post
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      // Text content of the post
      text: {
        type: String,
        trim: true,
      },
      // Image URL of the post
      img: {
        type: String,
        trim: true,
      },
      // Post type (original, retweet, reply)
      type: {
        type: String,
        enum: POST_TYPES,
        default: "original",
        required: true,
      },
      likes: [likeSchema],
      // Reference to the parent post (for retweets or replies)
      parentPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
        index: true,
      },
      // Array of child posts (replies)
      childPosts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      // Retweet count
      retweetCount: {
        type: Number,
        default: 0,
      },
      // Like count
      likeCount: {
        type: Number,
        default: 0,
      },
      // Reply count
      replyCount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

const Post = mongoose.model('Post', postSchema);
export default Post;