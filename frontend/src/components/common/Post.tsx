import { Link } from "react-router-dom";
import { PostType } from "../../utils/types";
import HeartIcon from "../svgs/HeartIcon";
import CommentIcon from "../svgs/CommentIcon";
import RetweetIcon from "../svgs/RetweetIcon";
import { GoBookmark, GoLink, GoPerson, GoUpload } from "react-icons/go";
import { formatDate } from "../../utils/formatDate";
import DropdownSettings from "../ui/DropdownSettings";
import { RiUserFollowLine } from "react-icons/ri";
import { useToast } from "../../hooks/ToastProvider";

const Post = ({post}: {post: PostType}) => {
  const toast = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Text copied to clipboard:", text);
            toast("success", "Link copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy text:", err);
            toast("error", "Failed to copy link to clipboard!");
        });
  };


  return (
    <div className="flex w-full h-fit p-[15px] items-start gap-3 border-b border-base-content/10">
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
            <span>@{post.user.username} · {formatDate(post.user.createdAt)}</span>
            <DropdownSettings>
              <li><Link to={`profile/${post.user.username}`}><GoPerson className='w-[1.3em] h-[1.3em]'/> Visit @user profile</Link></li>
              <li><a href=""><RiUserFollowLine className='w-[1.3em] h-[1.3em]'/> Follow @user</a></li>
              {/* If post is user's own post, show delete button */}
            </DropdownSettings>
          </div>
        </div>
        {post.text && <p>{post.text}</p>}
        {post.img &&
        <div className="w-full h-fit">
          <img src={post.img} className="w-fit h-fit max-h-[500px] object-cover rounded border border-neutral/30" alt="Post" />
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