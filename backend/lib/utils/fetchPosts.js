import Post from "../../models/post.model.js";

export const fetchPosts = async (filter, sortOptions = {}, populateOptions = []) => {
  return await Post.find(filter)
    .select("-likes -childPosts")
    .sort(sortOptions)
    .populate(populateOptions)
    .lean();
};
