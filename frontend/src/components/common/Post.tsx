import { Link } from "react-router-dom";
import { PostType } from "../../utils/types";
import HeartIcon from "../svgs/HeartIcon";
import CommentIcon from "../svgs/CommentIcon";
import RetweetIcon from "../svgs/RetweetIcon";
import { GoBookmark, GoLink, GoPerson, GoTrash, GoUpload } from "react-icons/go";
import { formatDate } from "../../utils/formatDate";
import DropdownSettings from "../ui/DropdownSettings";
import { RiUserFollowLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({post}: {post: PostType}) => {
  const {data: authUser} = useQuery({queryKey: ["authUser"]});
  const isMyPost = post.user._id === authUser._id;
  const queryClient = useQueryClient();

  const {mutate: deletePost, isPending} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while deleting the post.");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({queryKey: ["posts"]});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            toast.success("Link copied to clipboard!");
        })
        .catch(() => {
            toast.error("Failed to copy link to clipboard!");
        });
  };

  const handleDeletePost = () => {
    if (isMyPost){
      deletePost();
    }
  };

  const renderTextWithHashtags = (text: string): (JSX.Element | string)[] => {
    const parts = text.split(/(\s*#[^\s#]+\s*)/g);
    return parts.map((part, index) => {
      if (/^\s*#[^\s#]+\s*$/.test(part)) {
        return (
          <span key={index} className="text-blue-500">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  return (
    <div className="flex w-full h-fit p-[15px] items-start gap-3 border-b border-base-content/10 relative">
      {isPending &&
      <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-base-100/60 z-[1]">
        <LoadingSpinner size="lg" />
      </div>}
      <Link to={`/profile/${post.user.username}`} className='avatar'>
        <div className='w-10 rounded-full'>
          <img src={post.user.profileImg || "/avatar-placeholder.png"} alt={`Profile picture`}/>
        </div>
      </Link>
      <div className="flex flex-col w-full gap-2">
        <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-none xs:grid-cols-[auto_1fr] gap-[2px] xs:gap-2">
          <div className="flex w-fit h-fit justify-center items-start gap-[4px] text-base font-bold">
            <h3>{post.user.fullName}</h3>
            {/* <span>Badge</span> */}
          </div>
          <div className="flex w-full h-fit justify-between items-center text-neutral">
            <span>@{post.user.username} · {formatDate(post.createdAt)}</span>
            <DropdownSettings>
              <li><Link to={`profile/${post.user.username}`}><GoPerson className='w-[1.3em] h-[1.3em]'/> Visit @{post.user.username} profile</Link></li>
              {!isMyPost && <li><button type="button"><RiUserFollowLine className='w-[1.3em] h-[1.3em]'/> Follow @{post.user.username}</button></li>}
              {isMyPost && <li className="text-error" onClick={handleDeletePost}><button type="button"><GoTrash /> Delete Post</button></li>}
            </DropdownSettings>
          </div>
        </div>
        {post.text && <p>{renderTextWithHashtags(post.text)}</p>}
        {post.img &&
        <div className="w-full h-fit">
          <img src={post.img} className="w-fit max-w-full h-fit max-h-[418px] object-fit rounded border border-neutral/30" alt="Post" />
        </div>
        }
        <div className="flex justify-between items-center w-full h-fit fill-neutral pt-2">
          <div className="flex gap-6 xs:gap-10 w-fit h-fit">
            <button className="flex items-center gap gap-1 text-neutral text-base"
            type="button">
              <HeartIcon className="w-[1.3em] h-[1.3em]"/>
              {post.likeCount}
            </button>
            <button className="flex items-center gap gap-1 text-neutral text-base"
            type="button">
              <RetweetIcon className="w-[1.3em] h-[1.3em]"/>
              {post.retweetCount}
            </button>
            <button className="flex items-center gap gap-1 text-neutral text-base"
            type="button">
              <CommentIcon className="w-[1.3em] h-[1.3em]"/>
              {post.commentCount}
            </button>
          </div>
          <div className="flex gap-4 w-fit h-fit">
            <button className="flex items-center gap gap-1 text-neutral text-base"
            type="button" title="Save Post">
              <GoBookmark className="w-[1.3em] h-[1.3em]" />
            </button>
            <button className="flex items-center gap gap-1 text-neutral text-base"
            type="button" title="Share Post">
              <DropdownSettings dropDownIcon={<GoUpload className="w-[1.3em] h-[1.3em] fill-neutral" />}>
                <li className="flex" onClick={() => copyToClipboard(`https://x.ayberkyavas.com/posts/${post._id}`)}><p><GoLink className="w-[1.3em] h-[1.3em]"/> Copy Link</p></li>
              </DropdownSettings>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post