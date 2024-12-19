import { RiUserFollowFill } from "react-icons/ri";
import { GoBell } from "react-icons/go";
import Avatar from "../common/Avatar";
import EmbedPost from "../common/EmbedPost";
import HeartIcon from "../svgs/HeartIcon";
import RepostIcon from "../svgs/RepostIcon";
import CommentIcon from "../svgs/CommentIcon";

const Notification = ({ notification }: { notification: any }) => {
  const getNotificationMessage = (type: string) => {
    switch (type) {
      case "like":
        return "liked your post.";
      case "follow":
        return "started following you.";
      case "reply":
        return "commented on your post.";
      case "repost":
        return "reposted your post.";
      default:
        return "did something.";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <HeartIcon className="text-error w-full h-full" isLiked />;
      case "follow":
        return <RiUserFollowFill className="fill-warning w-full h-full" />;
      case "reply":
        return <CommentIcon className="text-primary w-full h-full" />;
      case "repost":
        return <RepostIcon className="text-success w-full h-full" isReposted/>;
      default:
        return <GoBell className="fill-warning" />;
    }
  };

  return (
    <div className={`text-base-content p-6 w-full mx-auto border-b border-base-content/10 ${notification.read ? "" : "bg-base-200"}`}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6">{getNotificationIcon(notification.type)}</div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar user={notification.from} className="w-8 h-8" />
              <h3 className="font-bold text-base">
                {notification.from.username}{" "}
                <span className="font-normal">
                  {getNotificationMessage(notification.type)}
                </span>
              </h3>
            </div>
          </div>
          {/* Tweet Metni */}
          {notification.type === "reply" && (
            <p className="mt-2 text-sm">
              <div className="flex flex-col gap-2 border border-base-content/10 p-4 rounded-md">
                <span className="text-neutral text-base">
                  {notification?.replyContext}
                </span>
                <EmbedPost post={notification?.postId} isSmall />
              </div>
            </p>
          )}
          {(notification.type === "repost" || notification.type === "like") && (
            <EmbedPost post={notification?.postId} isSmall />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
