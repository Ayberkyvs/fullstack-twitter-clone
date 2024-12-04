import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { PostType } from "../../utils/types";

const Post = ({post}: {post: PostType}) => {
  console.log(post)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex w-full h-fit p-[15px] items-start gap-3 border-b border-base-content/10">
      <Link to={`/profile/${post.user.username}`} className='avatar'>
        <div className='w-10 rounded-full'>
          <img src={post.user.profileImg || "/avatar-placeholder.png"} alt={`Profile picture`}/>
        </div>
      </Link>
      <div className="flex flex-col w-full gap-2">
        <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-none xs:grid-cols-[auto_1fr] gap-2">
          <div className="flex w-fit h-fit justify-center items-start gap-[4px] text-base font-bold">
            <h3>{post.user.fullName}</h3>
            {/* <span>Badge</span> */}
          </div>
          <div className="flex w-full h-fit justify-between items-center text-neutral">
            <span>@{post.user.username} · {formatDate(post.user.createdAt)}</span>
            <button title="More" type="button"><BsThreeDots /></button>
          </div>
        </div>
        {post.text && <p>{post.text}</p>}
        {post.img &&
        <div className="w-full h-fit">
          <img src={post.img} className="w-fit h-fit max-h-[500px] object-cover rounded border border-neutral/30" alt="Post" />
        </div>
        }
        <div className="">
          
        </div>
      </div>
    </div>
  )
}

export default Post