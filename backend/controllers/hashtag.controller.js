import Hashtag from "../models/hashtag.model.js";

export const getAllHashtags = async (req, res) => {
    try {
        const hashtags = await Hashtag.find()
            .sort({ createdAt: -1 })
            .limit(20);
        if (!hashtags || hashtags.length <= 0) return res.status(404).json({error: "No hashtags found"});
        res.status(200).json(hashtags);
    } catch (error) {
        console.error("Error in getAllHashtags controller: " + error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};