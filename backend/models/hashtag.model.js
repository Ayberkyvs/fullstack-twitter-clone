import mongoose from 'mongoose';

const hashtagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    usageCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

hashtagSchema.index({ usageCount: -1 });
hashtagSchema.index({updatedAt: 1},{expires: '10d'}); //! Probably not working

const Hashtag = mongoose.model('Hashtag', hashtagSchema);
export default Hashtag;