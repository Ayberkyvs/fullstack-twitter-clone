import { extractHashtags } from "../lib/utils/extractHashtags.js";
import Hashtag from "../models/hashtag.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    if (!postId)
      return res.status(400).json({ message: "Post ID is required" });
    const post = await Post.findById(postId)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const currentUserId = req.user._id.toString();

    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!text && !img)
      return res.status(400).json({ message: "Text or image is required" });
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: currentUserId,
      text: text ? text : null,
      img: img ? img : null,
      type: "original",
    });
    const savedPost = await newPost.save();
    const hashtags = extractHashtags(text);

    for (const tag of hashtags) {
      let hashtag = await Hashtag.findOne({ tag });
      if (!hashtag) {
        hashtag = new Hashtag({
          tag,
          posts: [savedPost._id],
          usageCount: 1,
        });
      } else {
        hashtag.posts.push(savedPost._id);
        hashtag.usageCount++;
      }
      await hashtag.save();
    }

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error in createPost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    const hashtags = await Hashtag.find({ posts: req.params.id });
    for (const tag of hashtags) {
      //! 2 tane gereksiz find islemi yapiliyor.
      const updatedTag = await Hashtag.findOneAndUpdate(
        {
          _id: tag._id,
        },
        {
          $pull: {
            posts: req.params.id,
          },
          $inc: {
            usageCount: -1,
          },
        },
        { new: true }
      );
      console.log("Updated Tag: ", updatedTag);
      if (updatedTag.usageCount <= 0) {
        await Hashtag.deleteOne({ _id: updatedTag._id });
      }
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const isLiked = post.likes.some(
      (like) => like.user.toString() === currentUserId.toString()
    );

    if (isLiked) {
      //? Unlike the post
      post.likes.pull({ user: currentUserId });
      post.likeCount -= 1;
      await User.findByIdAndUpdate(currentUserId, {
        $pull: {
          likedPosts: postId,
        },
      });
      await post.save();
      await Notification.deleteOne({
        from: currentUserId,
        to: post.user,
        type: "like",
      });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //? like the post
      post.likes.push({ user: currentUserId });
      post.likeCount += 1;
      await User.findByIdAndUpdate(currentUserId, {
        $push: {
          likedPosts: postId,
        },
      });
      await post.save();
      // Create a notification to inform the post owner that their post has been liked
      const notification = new Notification({
        from: currentUserId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const currentUserId = req.user._id;

    if (!text)
      return res.status(400).json({ message: "Text field is required" });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = {
      user: currentUserId,
      text,
    };
    post.comments.push(comment);
    post.commentCount += 1;
    await post.save();

    const notification = new Notification({
      from: currentUserId,
      to: post.user,
      type: "comment",
    });
    await notification.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in commentOnPost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length <= 0) return res.status(200).json([]);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const currentUserId = req.user._id;
  try {
    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const likedPosts = await Post.find({
      _id: {
        $in: user.likedPosts,
      },
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (likedPosts.length <= 0) return res.status(200).json([]);

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error in getLikedPosts controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const following = user.following;
    const feedPosts = await Post.find({
      user: {
        $in: following,
      },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (feedPosts.length <= 0) return res.status(200).json([]);
    return res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error in getFollowingPosts controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username)
      return res.status(400).json({ message: "Username is required" });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length <= 0) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
