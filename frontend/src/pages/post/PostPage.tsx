import React from "react";
import { Link, useParams } from "react-router-dom";
import PageHeading from "../../components/ui/PageHeading";
import Avatar from "../../components/common/Avatar";
import { PostType, UserType } from "../../utils/types";
import DropdownSettings from "../../components/ui/DropdownSettings";
import { GoPerson, GoTrash } from "react-icons/go";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import postActions from "../../utils/postActions";
import { useQuery } from "@tanstack/react-query";
import renderTextWithHashtags from "../../utils/renderWithHashtags";
import PostActions from "../../components/common/postActions/index";
import Post from "../../components/common/Post";
import EmbedPost from "../../components/common/EmbedPost";
import CreatePost from "../home/CreatePost";
import NotFound from "../../components/common/NotFound";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import findBadge from "../../utils/findBadge";

const PostPage = () => {
  const param = useParams();
  const postId = param.id;

  const {
    data: post,
    isPending: isPostLoading,
    isError: isPostError,
  } = useQuery<PostType>({
    queryKey: ["posts", postId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while fetching replies"
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  const {
    data: replies,
    isPending: isRepliesLoading,
    refetch: refetchReplies,
    isRefetching: isRepliesRefetching,
  } = useQuery<PostType[]>({
    queryKey: ["posts", "replies"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/replies/${postId}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while fetching replies"
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    placeholderData: [],
  });

  React.useEffect(() => {
    // refetchPost();
    refetchReplies();
  }, [postId]);

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  //? Replace follow, deletePost
  const { follow, deletePost } = postActions();

  const user = post?.user as UserType;

  const postUserId = user?._id;
  const isMyPost = postUserId === authUser?._id;
  const isFollowing = authUser?.following.includes(postUserId);

  const isReply =
    post?.type === "reply" && post?.parentPost?.user ? true : false;
  const isSmall = post?.img && post?.parentPost?.img && isReply ? true : false;

  return (
    <div className="flex flex-col justify-center items-start w-full">
      <PageHeading title="Post" headerMobile={false}/>
      {isPostError && <NotFound className="mt-2" errorMessage="Post Not Found!"/>}

      {isPostLoading && <PostSkeleton />}
      {post && !isPostLoading && (
        <div className="w-full flex flex-col p-4 gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar
                user={user}
                className="flex-shrink-0 w-8 h-8 xs:w-10 xs:h-10"
              />
              <div>
                <h1 className="flex gap-1 w-fit font-bold text-base">{user.fullName} {user?.badge && findBadge(user?.badge)}</h1>
                <p className="text-neutral">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isMyPost && (
                <button
                  title="Follow"
                  type="button"
                  className="btn btn-xs hover:bg-base-content/60 bg-base-content text-base-100 w-fit h-[40px] px-4 text-base font-bold rounded-full"
                  onClick={() => follow(user._id)}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
              <DropdownSettings buttonClassName="m-0 h-full">
                <li>
                  <Link to={`profile/${user.username}`}>
                    <GoPerson className="w-[1.3em] h-[1.3em]" /> Visit @
                    {user.username} profile
                  </Link>
                </li>
                {!isMyPost && (
                  <li>
                    <button type="button" onClick={() => follow(user._id)}>
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
                      @{user.username}
                    </button>
                  </li>
                )}

                {isMyPost && (
                  <li
                    className="text-error"
                    onClick={() => deletePost(post._id)}
                  >
                    <button type="button">
                      <GoTrash /> Delete Post
                    </button>
                  </li>
                )}
              </DropdownSettings>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {post.text && <p>{renderTextWithHashtags(post.text)}</p>}
            {post.img && (
              <div className="w-full h-fit mt-2">
                <img
                  src={post.img}
                  className="w-fit max-w-full h-fit max-h-[418px] object-fit rounded border border-neutral/30"
                  alt="Post"
                />
              </div>
            )}
            {isReply && post.parentPost && (
              <EmbedPost post={post?.parentPost} isSmall={isSmall} />
            )}
          </div>
          <div className="w-full py-2 border-b border-base-content/10">
            <span className="text-neutral w-fit">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="py-2 border-b border-base-content/10">
            <PostActions post={post} />
          </div>
        </div>
      )}
      <div className="w-full px-2">
        {!isPostLoading && post && !isPostError && (
          <CreatePost
            type="reply"
            parentPostId={post?._id}
            className="border-b border-base-content/10"
            showAvatar={false}
          />
        )}
        <ul className="flex flex-col items-center justify-center gap-3 min-h-[350px] border">
          {(isRepliesLoading || isRepliesRefetching) &&
            Array.from({ length: 4 }).map((_, index) => (
              <PostSkeleton key={index} image={false} />
            ))}
          {!isRepliesLoading &&
            !isRepliesRefetching &&
            replies &&
            replies.map((p) => (
              <li key={p._id} className="w-full">
                <Post post={p} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default PostPage;
