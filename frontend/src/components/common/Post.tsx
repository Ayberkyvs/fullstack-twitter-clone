import { Link } from "react-router-dom";
import { PostType, UserType } from "../../utils/types";
import HeartIcon from "../svgs/HeartIcon";
import CommentIcon from "../svgs/CommentIcon";
import RetweetIcon from "../svgs/RetweetIcon";
import {
  GoBookmark,
  GoLink,
  GoPerson,
  GoTrash,
  GoUpload,
} from "react-icons/go";
import { formatDate } from "../../utils/formatDate";
import DropdownSettings from "../ui/DropdownSettings";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../hooks/useFollow";
import Modal from "../ui/Modal";
import CreatePost from "../../pages/home/CreatePost";

const Post = ({ post }: { post: PostType }) => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const { follow, isPending: isFollowPending } = useFollow();

  const postUserId = post.user._id;
  const postId = post._id;
  const isMyPost = postUserId === authUser?._id;
  const isFollowing = authUser?.following.includes(postUserId);
  const isLiked = authUser?.likedPosts.includes(postId);
  const isRetweeted = false;
  const modalName = `comment_${post._id}_modal`;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while deleting the post."
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        if (post.type === "reply") {
          const updatedData = oldData
            .map((p) => {
              if (p._id === post.parentPost) {
                toast.success(`You deleted your reply to ${p.user.username}'s post successfully`);
                return { ...p, replyCount: p.replyCount - 1 };
              }
              return p;
            })
            .filter((p) => p._id !== post._id); // Silinen postu listeden çıkar
          return updatedData;
        }
        // Eğer type "original" ise, sadece postu sil
        toast.success("You deleted your post successfully");
        return oldData.filter((p) => p._id !== post._id); // Silinen postu listeden çıkar
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "An error occurred while liking post.");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (res) => {
      const updatedLikeCount = res.updatedLikeCount;
      const updatedLikes = res.updatedLikes;
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        return oldData.map((p) => {
          if (p._id === postId) {
            console.log("asda: " + res.updatedLikeCount);
            return { ...p, likes: updatedLikes, likeCount: updatedLikeCount };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard!");
      });
  };
  const handleDeletePost = () => {
    if (!isMyPost || isDeleting) return;
    deletePost();
  };
  const renderTextWithHashtags = (text: string): (JSX.Element | string)[] => {
    const parts = text.split(/(\s*#[^\s#]+\s*)/g);
    return parts.map((part, index) => {
      if (/^\s*#[^\s#]+\s*$/.test(part)) {
        queryClient.invalidateQueries({ queryKey: ["trending"] });
        return (
          <span key={index} className="text-blue-500">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  const handleFollow = () => {
    if (isFollowPending) return;
    follow(postUserId);
  };
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="flex w-full h-fit p-[15px] items-start gap-3 border-b border-base-content/10 relative hover:bg-base-200/50">
      {(isDeleting || isLiking) && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-base-100/60 z-[1]">
          <LoadingSpinner size="lg" />
        </div>
      )}
      <Link to={`/profile/${post.user.username}`} className="avatar">
        <div className="w-10 rounded-full">
          <img
            src={post.user.profileImg || "/avatar-placeholder.png"}
            alt={`Profile picture`}
          />
        </div>
      </Link>
      <div className="flex flex-col w-full gap-2">
        <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-none xs:grid-cols-[auto_1fr] gap-[2px] xs:gap-2">
          <div className="flex w-fit h-fit justify-center items-start gap-[4px] text-base font-bold">
            <h3>{post.user.fullName}</h3>
            {/* <span>Badge</span> */}

          </div>
          <div className="flex w-full h-fit justify-between items-center text-neutral">
            <span>
              @{post.user.username} · {formatDate(post.createdAt)}
            </span>
            <DropdownSettings>
              <li>
                <Link to={`profile/${post.user.username}`}>
                  <GoPerson className="w-[1.3em] h-[1.3em]" /> Visit @
                  {post.user.username} profile
                </Link>
              </li>
              {!isMyPost && (
                <li>
                  <button type="button" onClick={handleFollow}>
                    {isFollowing ? (
                      <>
                        <RiUserUnfollowLine className="w-[1.3em] h-[1.3em]" />{" "}
                        Unfollow
                      </>
                    ) : (
                      <>
                        <RiUserFollowLine className="w-[1.3em] h-[1.3em]" />{" "}
                        Follow
                      </>
                    )}{" "}
                    @{post.user.username}
                  </button>
                </li>
              )}

              {isMyPost && (
                <li className="text-error" onClick={handleDeletePost}>
                  <button type="button">
                    <GoTrash /> Delete Post
                  </button>
                </li>
              )}
            </DropdownSettings>
          </div>
        </div>
        {post.text && <p>{renderTextWithHashtags(post.text)}</p>}
        {post.img && (
          <div className="w-full h-fit">
            <img
              src={post.img}
              className="w-fit max-w-full h-fit max-h-[418px] object-fit rounded border border-neutral/30"
              alt="Post"
            />
          </div>
        )}
        <div className="flex justify-between items-center w-full h-fit fill-neutral pt-2">
          <div className="flex gap-6 xs:gap-10 w-fit h-fit">
            <Modal modalName={modalName} trigger={
              <label
              className="flex items-center gap gap-1 text-neutral text-base hover:text-primary"
              role="button"
              htmlFor={modalName}
            >
              <CommentIcon className="w-[1.3em] h-[1.3em]" />
              {post.replyCount}
            </label>
            }>
                <CreatePost className="flex-wrap gap-6" type="reply" parentPostId={post._id} />
            </Modal>
            <button
              className={`flex items-center gap gap-1 text-base hover:text-success ${
                isRetweeted ? "text-success" : "text-neutral"
              }`}
              type="button"
            >
              <RetweetIcon className="w-[1.3em] h-[1.3em]" />
              {post.retweetCount}
            </button>
            <button
              className={`flex items-center gap gap-1 text-base hover:text-error ${
                isLiked ? "text-error" : "text-neutral"
              }`}
              type="button"
              onClick={handleLikePost}
            >
              <HeartIcon className="w-[1.3em] h-[1.3em]" />
              {post.likeCount}
            </button>
          </div>
          <div className="flex gap-4 w-fit h-fit">
            <button
              className="flex items-center gap gap-1 text-neutral text-base hover:text-primary"
              type="button"
              title="Save Post"
            >
              <GoBookmark className="w-[1.3em] h-[1.3em]" />
            </button>
            <button
              className="flex items-center gap gap-1 text-neutral text-base"
              type="button"
              title="Share Post"
            >
              <DropdownSettings
                dropDownIcon={
                  <GoUpload className="w-[1.3em] h-[1.3em] hover:text-primary" />
                }
              >
                <li
                  className="flex"
                  onClick={() =>
                    copyToClipboard(
                      `https://x.ayberkyavas.com/${post.user.username}/posts/${post._id}`
                    )
                  }
                >
                  <p>
                    <GoLink className="w-[1.3em] h-[1.3em]" /> Copy Link
                  </p>
                </li>
              </DropdownSettings>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
