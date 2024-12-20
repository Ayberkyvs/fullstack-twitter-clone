import Actions from "./actions";
import PostActionsUI from "./PostActionsUI";
import { PostType } from "../../../utils/types";
import React from "react";

interface PostActionsProps {
  post: PostType;
}

const PostActions = ({ post }: PostActionsProps) => {
  const {
    likePost,
    isLiking,
    repost,
    isReposting,
    copyToClipboard,
  } = Actions();
  const [isLiked, setIsLiked] = React.useState<boolean | null>(null);
  const [isReposted, setIsReposted] = React.useState<boolean | null>(null);

  const postId = post._id;

  const handleLike = () => {
    if (isLiking) return;
    likePost({ postId, setIsLiked });
  };
  const handleRepost = () => {
    if (isReposting) return;
    repost({postId, setIsReposted});
  };

  return (
    <div onClick={(e) => e.preventDefault()}>
    <PostActionsUI
      post={post}
      isLikedOptimistic={isLiked}
      setIsLikedOptimistic={setIsLiked}
      isRepostedOptimistic={isReposted}
      setIsRepostedOptimistic={setIsReposted}
      onLike={handleLike}
      onRepost={handleRepost}
      onCopyLink={() =>
        copyToClipboard(
          `https://fullstack-twitter-clone-hoaw.onrender.com/${post.user.username}/status/${post._id}`
        )
      }
      isLiking={isLiking}
      isReposting={isReposting}
    />
    </div>
  );
};

export default PostActions;
