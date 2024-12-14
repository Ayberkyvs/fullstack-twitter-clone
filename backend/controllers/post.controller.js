import { extractHashtags } from "../lib/utils/extractHashtags.js";
import Hashtag from "../models/hashtag.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import { populate } from "dotenv";

// export const getPostById = async (req, res) => {
//   const postId = req.params.id;
//   try {
//     if (!postId)
//       return res.status(400).json({ message: "Post ID is required" });
//     const post = await Post.findById(postId)
//       .populate({ path: "user", select: "-password" })
//       .populate({ path: "comments.user", select: "-password" });
//     if (!post) return res.status(404).json({ message: "Post not found" });
//     res.status(200).json(post);
//   } catch (error) {
//     console.error("Error in getPostById controller: " + error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const { type: postType } = req.body;
    const { parentPostId } = req.body;
    const currentUserId = req.user._id.toString();

    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if ((!text && !img) || (text && text.trim() === "" && !img))
      return res.status(400).json({ message: "Text or image is required" });
    if (postType !== "original" && postType !== "reply")
      return res.status(400).json({ message: "Invalid post type" });
    if (postType === "reply" && !parentPostId)
      return res.status(400).json({ message: "Parent post ID is required" });
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        folder: `${currentUserId}/posts`,
        format: "webp",
        allowed_formats: ["webp", "png", "jpg", "jpeg"],
        transformation: [
          { width: 800, height: 418, crop: "limit", quality: "auto" },
          { fetch_format: "auto" },
        ],
      });
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: currentUserId,
      text: text ? text : null,
      img: img ? img : null,
      type: postType,
      parentPost: postType === "reply" ? parentPostId : null,
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

    let populatedPost;
    if (postType === "reply") {
      const parentPost = await Post.findById(parentPostId);
      if (!parentPost)
        return res.status(404).json({ message: "Parent post not found" });
      parentPost.childPosts.push(savedPost._id);
      parentPost.replyCount += 1;
      await parentPost.save();
      populatedPost = await Post.findById(savedPost._id)
      .select("-likes -childPosts")
      .populate({
        path: "user",
        select: "-password"
      })
      .populate({
        path: "parentPost",
        select: "-likes -childPosts",
        populate: {
          path: "user",
          select: "+username +fullName"
        }
      });
    } else {
      populatedPost = await Post.findById(savedPost._id)
      .select("-likes -childPosts")
      .populate({ path: "user", select: "-password" });
    }

    res.status(201).json(populatedPost);
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
      const imgUrl = post.img;
      const imgPath = imgUrl.split("/").slice(-3).join("/");
      const imgId = imgPath.split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    const hashtags = await Hashtag.find({ posts: req.params.id });
    const bulkOperations = hashtags.map((tag) => ({
      updateOne: {
        filter: { _id: tag._id },
        update: {
          $pull: { posts: req.params.id },
          $inc: { usageCount: -1 },
        },
      },
    }));
    await Hashtag.bulkWrite(bulkOperations);
    await Hashtag.deleteMany({ usageCount: { $lte: 0 } });

    // Remove the post from the likedPosts array of all users who liked it
    //await User.updateMany({$pull: {likedPosts: req.params.id}}).exec();

    if (post.type === "reply") {
      const parentPost = await Post.findById(post.parentPost);
      if (parentPost) {
        parentPost.childPosts.pull(post._id);
        parentPost.replyCount -= 1;
        await parentPost.save();
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
      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      const updatedLikeCount = post.likeCount;
      res.status(200).json({ updatedLikes, updatedLikeCount });
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

      const updatedLikes = post.likes;
      const updatedLikeCount = post.likeCount;
      res.status(200).json({ updatedLikes, updatedLikeCount });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({type : "original"})
      .select("-likes -childPosts")
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" });

    if (posts.length <= 0) return res.status(200).json([]);
    console.log(posts);
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
    // Find user and populate 'following' field
    const user = await User.findById(currentUserId).populate("following");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const following = user.following;
    
    // 1. Get normal posts from users being followed
    const normalPosts = await Post.find({
      user: { $in: following.map((f) => f._id) },
    })
      .select("-likes -childPosts")
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "parentPost", select: "-likes -childPosts", populate: { path: "user", select: "+username +fullName" } })
      .lean(); // Use lean to work with plain JavaScript objects
    
    // 2. Get reposted posts and include reposting user info
    const repostedPostsPromises = following.map(async (followedUser) => {
      const repostedPosts = await Post.find({
        _id: { $in: followedUser.repostedPosts.map((r) => r.post) },
      })
        .select("-likes -childPosts")
        .sort({ createdAt: -1 })
        .populate({ path: "user", select: "-password" })
        .lean(); // Use lean for plain objects
      
      // Add repostedAt field to each reposted post
      repostedPosts.forEach((post) => {
        post.repostedBy = followedUser; // Add reposting user information
        post.repostedAt = followedUser.repostedPosts.find(r => r.post.toString() === post._id.toString())?.createdAt; // Use repost timestamp if available
        post.type = "repost"; // Add type field to distinguish reposted posts
      });
      
      return repostedPosts;
    });

    const repostedPosts = (await Promise.all(repostedPostsPromises)).flat();

    // 3. Merge normal posts and reposted posts
    const feedPosts = [...normalPosts, ...repostedPosts];

    // Sort the posts by either createdAt (for normal posts) or repostedAt (for reposted posts)
    feedPosts.sort((a, b) => {
      const dateA = a.repostedAt || a.createdAt; // Use repostedAt if present
      const dateB = b.repostedAt || b.createdAt; // Use repostedAt if present
      return new Date(dateB) - new Date(dateA); // Compare the dates
    });

    // If no posts found, return empty array
    if (feedPosts.length <= 0) return res.status(200).json([]);
    
    // Return the feed posts
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

export const repostPost = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the post is already reposted
    const alreadyReposted = user.repostedPosts.some(repost => repost?.post?.toString() === postId);

    if (alreadyReposted) {
      // If already reposted, remove it
      user.repostedPosts = user.repostedPosts.filter(repost => repost?.post?.toString() !== postId);
      await user.save();

      if (post.repostCount > 0) post.repostCount -= 1;
      await post.save();
    } else {
      // If not reposted, create a new repost
      user.repostedPosts.push({ post: postId });
      await user.save();

      post.repostCount += 1;
      await post.save();
    }

    const updatedRepostCount = post.repostCount;
    res.status(200).json({ updatedRepostCount });
  } catch (error) {
    console.error("Error in repostPost controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
