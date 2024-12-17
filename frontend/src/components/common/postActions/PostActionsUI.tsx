import { PostType, UserType } from "../../../utils/types";
import Modal from "../../ui/Modal";
import CommentIcon from "../../svgs/CommentIcon";
import CreatePost from "../../../pages/home/CreatePost";
import RepostIcon from "../../svgs/RepostIcon";
import HeartIcon from "../../svgs/HeartIcon";
import { GoBookmark, GoLink, GoUpload } from "react-icons/go";
import DropdownSettings from "../../ui/DropdownSettings";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";

type PostActionsUIProps = {
  post: PostType;
  onLike: () => void;
  onRepost: () => void;
  onCopyLink: () => void;
  isLiking: boolean;
  isReposting: boolean;
  isLikedOptimistic: boolean | null;
  setIsLikedOptimistic: React.Dispatch<React.SetStateAction<boolean | null>>;
  isRepostedOptimistic: boolean | null;
  setIsRepostedOptimistic: React.Dispatch<React.SetStateAction<boolean | null>>;
};
const PostActionsUI = ({
  post,
  onLike,
  onRepost,
  onCopyLink,
  isLiking,
  isReposting,
  isLikedOptimistic,
  setIsLikedOptimistic,
  isRepostedOptimistic,
  setIsRepostedOptimistic,
}: PostActionsUIProps) => {
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  isLikedOptimistic ?? setIsLikedOptimistic(authUser?.likedPosts.includes(post._id) ?? false);
  // isRepostedOptimistic ?? setIsRepostedOptimistic(authUser?.repostedPosts.includes(post._id) ?? false); // Typescript error here but its right bro idk;
  const isLiked = isLikedOptimistic;
  const isReposted = authUser?.repostedPosts.includes(post._id) ?? false;
  const modalName = `comment_${post._id}_modal`;

  return (
    <div className="flex justify-between items-center w-full h-fit fill-neutral">
      <div className="flex gap-6 xs:gap-10 w-fit h-fit">
        <Modal
          modalName={modalName}
          trigger={
            <button
              className="flex items-center gap gap-1 text-neutral text-base hover:text-primary"
              role="button"
              type="button"
              onClick={() => {
                const modal = document.getElementById(
                  `${modalName}`
                ) as HTMLDialogElement | null;
                modal?.showModal();
              }}
            >
              <CommentIcon className="w-[1.3em] h-[1.3em]" />
              {post.replyCount}
            </button>
          }
        >
          <CreatePost
            className="flex-wrap gap-6"
            type="reply"
            parentPostId={post._id}
          />
        </Modal>
        <button
          className={`flex items-center gap gap-1 text-base hover:text-success ${
            isReposted ? "text-success" : "text-neutral"
          }`}
          type="button"
          onClick={onRepost}
        >
          {isReposting ? (
            <LoadingSpinner
              size="sm"
              className="w-[1.3em] h-[1.3em] text-current"
            />
          ) : (
            <RepostIcon className="w-[1.3em] h-[1.3em]" isReposted={isReposted ?? false} />
          )}

          {post.repostCount}
        </button>
        <button
          className={`flex items-center gap gap-1 text-base hover:text-error ${
            isLiked ? "text-error" : "text-neutral"
          }`}
          type="button"
          onClick={onLike}
          disabled={isLiking}
          title={isLiked ? "Unlike" : "Like"}
        >
          {isLiking && false ? (
            <LoadingSpinner
              size="sm"
              className="w-[1.3em] h-[1.3em] text-current"
            />
          ) : (
            <HeartIcon className="w-[1.3em] h-[1.3em]" isLiked={isLiked ?? false}/>
          )}
          {post.likeCount < 0 ? 0 : post.likeCount}
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
            <li className="flex" onClick={onCopyLink}>
              <p>
                <GoLink className="w-[1.3em] h-[1.3em]" /> Copy Link
              </p>
            </li>
          </DropdownSettings>
        </button>
      </div>
    </div>
  );
};

export default PostActionsUI;
