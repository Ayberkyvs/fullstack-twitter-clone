import { Link, useNavigate } from "react-router-dom";
import { PostType, UserType } from "../../utils/types";
import CommentIcon from "../svgs/CommentIcon";
import RepostIcon from "../svgs/RepostIcon";
import {
  GoPerson,
  GoTrash,
} from "react-icons/go";
import { formatDate } from "../../utils/formatDate";
import DropdownSettings from "../ui/DropdownSettings";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../hooks/useFollow";
import EmbedPost from "./EmbedPost";
import renderTextWithHashtags from "../../utils/renderWithHashtags";
import Avatar from "./Avatar";
import PostActions from "./postActions";
import findBadge from "../../utils/findBadge";

const Post = ({ post }: { post: PostType }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  const { follow, isPending: isFollowPending } = useFollow();

  const postUserId = post?.user?._id;
  const postId = post?._id;
  const isMyPost = postUserId === authUser?._id;
  const isFollowing = authUser?.following.includes(postUserId);
  const isReply:boolean = (post.type === "reply" && post.parentPost?.user) ? true : false;
  const isSmall:boolean = (post.img && post.parentPost?.img && isReply) ? true : false;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${postId}`, {
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
    onMutate: async () => {
      await queryClient.cancelQueries();

      const updateReplyCount = (oldData: PostType[]) => {
        if (!oldData) return oldData;
        return oldData
          ?.map((p) =>
            p._id === post.parentPost?._id ? { ...p, replyCount: p.replyCount - 1 } : p
          )
          .filter((p) => p._id !== post._id);
      };

      queryClient.setQueryData(["posts", "replies"], (oldData: PostType[]) => {
        if (post.type === "reply") {
          return updateReplyCount(oldData);
        }
        return oldData;
      });

      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        if (post.type === "reply") {
          return updateReplyCount(oldData);
        }
        if (!oldData) return oldData;
        return oldData.filter((p) => p._id !== post._id);
      });

      queryClient.setQueryData(["posts", post?.parentPost?._id], (oldData: PostType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          replyCount: oldData.replyCount - 1,
        };
      });
    },
    onSuccess: () => {
      if (post.type === "reply") {
        toast.success(`You deleted your reply successfully`);
      } else if (post.type === "original") {
        toast.success("You deleted your post successfully");
      } else {
        toast.success("You deleted something successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts", post.parentPost?._id], exact: true });
    },
    onError: (error: Error) => {
      navigate(`${authUser?.username}/status/${postId}`);
      toast.error(error.message || "An error occurred.");
      const queriesToInvalidate = [
        ["authUser"],
        ["posts"],
        ["posts", "replies"],
        ["posts", post?.parentPost?._id],
      ];
      queriesToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  const handleDeletePost = () => {
    if (!isMyPost || isDeleting) return;
    deletePost();
  };
  const handleFollow = () => {
    if (isFollowPending) return;
    follow(postUserId);
  };

  return (
    <Link to={`/${post?.user?.username}/status/${post?._id}`} className="relative w-full flex flex-col items-start h-fit p-2 xs:p-[15px] border-b border-base-content/10 hover:bg-base-200/50">
      {(isDeleting) && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-base-100/60 z-[1]">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {isReply && (
        <p className="flex justify-center items-center text-neutral gap-2 text-sm px-5 font-bold">
          <CommentIcon className="w-[1.1em] h-[1.1em]" />
          {isMyPost ? "You" : `@${post?.user?.username}`} replied to{" "}
          <span className="text-primary">
            @{post?.parentPost?.user?.username}
          </span>{" "}
          post.
        </p>
      )}
      {post?.repostedBy && (
        <p className="flex justify-center items-center text-neutral gap-2 text-sm px-5 font-bold">
          <RepostIcon className="w-[1.1em] h-[1.1em]" isReposted/>
          {post?.repostedBy?.username} reposted
        </p>
      )}
      <div className="flex w-full h-fit gap-3">
        <Avatar
          user={post?.user}
          className="w-9 h-9 xs:w-10 xs:h-10"
        />
        <div className="flex flex-col w-full h-fit gap-1">
          <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-none xs:grid-cols-[auto_1fr] gap-[2px] xs:gap-2">
            <div className="flex w-fit h-fit justify-center items-center gap-1 text-base font-bold">
              <h3>{post?.user?.fullName}</h3>
              {post.user?.badge && <span>{findBadge(post.user?.badge)}</span>}
            </div>
            <div className="flex w-full h-fit justify-between items-center text-neutral">
              <span className="text-sm xs:text-base">
                @{post?.user?.username} · {formatDate(post?.createdAt)}
              </span>
              <DropdownSettings buttonClassName="m-0 h-full">
                <li>
                  <Link to={`profile/${post?.user?.username}`}>
                    <GoPerson className="w-[1.3em] h-[1.3em]" /> Visit @
                    {post?.user?.username} profile
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
                      @{post?.user?.username}
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
          <div className="w-full h-fit">
            {post.text && <p>{renderTextWithHashtags(post.text)}</p>}
            {post.img && (
              <div className="w-fit h-fit mt-2">
                <img
                  src={post.img}
                  className="w-fit max-w-full h-fit max-h-[318px] xs:max-h-[418px] object-cover rounded-xl border border-neutral/30"
                  alt="Post"
                />
              </div>
            )}
          </div>
          {isReply && post.parentPost && (
            <EmbedPost post={post.parentPost} isSmall={isSmall} />
          )}
          <PostActions post={post} />
        </div>
      </div>
    </Link>
  );
};

export default Post;
