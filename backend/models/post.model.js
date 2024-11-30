import mongoose from 'mongoose';
import Hashtag from './hashtag.model.js';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
}, { timestamps: true });

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const POST_TYPES = ['original', 'retweet', 'quote'];

const postSchema = new mongoose.Schema({
    // User who created the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Text content of the post
    text: {
        type: String,
    },
    // Image URL of the post
    img: {
        type: String,
    },
    // Type of the post (original, retweet, quote)
    type: {
        type: String,
        enum: POST_TYPES,
        default: 'original',
        required: true
    },
    // Likes on the post
    likes: [likeSchema],
    // Comments on the post
    comments: [commentSchema],
    // Original post reference for retweets and quotes
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null,
        index: true
    },
    // Hashtags associated with the post
    hashtags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hashtag',
        index: true
    }],
    // Mentions in the post
    // mentions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     index: true
    // }],
    // Count of comments on the post
    commentCount: {
        type: Number,
        default: 0
    },
    // Count of likes on the post
    likeCount: {
        type: Number,
        default: 0
    },
    // Count of retweets of the post
    retweetCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

postSchema.pre('save', async function(next) {
    try {
        if ((this.type === 'retweet' || this.type === 'quote') && !this.originalPost) {
            return next(new Error('Original post must be provided for retweets or quotes.'));
        }

        if (this.type === 'retweet' && this.originalPost) {
            // Eğer bu bir retweetse, orijinal postun retweetCount'ını artır.
            await this.model('Post').findByIdAndUpdate(this.originalPost, { $inc: { retweetCount: 1 } });
        }
        next();
    }catch(err){
        return next(err);
    }
});

postSchema.pre('remove', async function(next) {
    try {
        if (this.type === 'original') {
            // Orijinal postun retweet'lerini sil
            await this.model('Post').deleteMany({ originalPost: this._id });
            next();
        }
        if (this.type === 'retweet' && this.originalPost) {
            // Eğer bu bir retweetse, orijinal postun retweetCount'ını azalt.
            await this.model('Post').findByIdAndUpdate(this.originalPost, { $inc: { retweetCount: -1 } });
        }
        next();
    }
    catch (err) {
        next(err);
    }

});

const Post = mongoose.model('Post', postSchema);
export default Post;