import { Link } from "react-router-dom";
import { PostType } from "../../utils/types";
import { formatDate } from "../../utils/formatDate";
import renderTextWithHashtags from "../../utils/renderWithHashtags";

const EmbedPost = ({ post, isSmall }: { post: PostType; isSmall: boolean }) => {
  if (!post) return null;
  const {text, img} = post;
  return (
    <Link
      to={`/${post.user.username}/status/${post._id}`}
      className="flex flex-col w-full h-full max-h-[600px] bg-base-100 rounded p-[15px] border border-base-content/10 hover:bg-base-200/50 gap-2"
    >
      <div className="flex flex-wrap gap-2 w-full h-fit">
        <Link to={`/profile/${post.user.username}`} className="avatar">
          <div className="flex-shrink-0 w-6 h-6 rounded-full">
            <img
              src={post.user.profileImg || "/avatar-placeholder.png"}
              alt={`Profile picture`}
              className="w-full h-full"
            />
          </div>
        </Link>
        <div className="flex w-fit h-fit justify-center items-start gap-[4px] text-base font-bold">
          <h3>{post.user.fullName}</h3>
          {/* <span>Badge</span> */}
        </div>
        <span className="text-neutral">
          @{post.user.username} · {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Alt kısım düzeni */}
      <div
        className={`flex w-full h-fit gap-2 ${
          isSmall ? "flex-row" : "flex-col-reverse"
        }`}
      >
        {img && (
          <img
            src={img}
            className={`object-fit rounded border border-neutral/30 max-h-[418px] ${isSmall ? "w-24 h-24" : "w-fit h-fit"}`}
            alt="Post"
          />
        )}
        {text && (
          <p className="w-full h-fit break-words overflow-auto">{renderTextWithHashtags(text)}</p>
        )}
      </div>
    </Link>
  );
};

export default EmbedPost;
