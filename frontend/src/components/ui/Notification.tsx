import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import { GoBell } from "react-icons/go";
import Avatar from "../common/Avatar";

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
        return "retweeted your post.";
      default:
        return "did something.";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <FcLike className="fill-error w-full h-full" />;
      case "follow":
        return <RiUserFollowFill className="fill-primary w-full h-full" />;
      case "comment":
        return <FaComment className="fill-info w-full h-full" />;
      case "retweet":
        return <AiOutlineRetweet className="fill-success w-full h-full" />;
      default:
        return <GoBell className="fill-warning" />;
    }
  };

  console.log(notification);
  return (
    <div className="text-base-content p-6 w-full mx-auto border-b border-base-content/10">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6">{getNotificationIcon(notification.type)}</div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-3">
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
          {/* {notification.type === "reply" && (
            <p className="mt-2 text-sm">
              <span className="text-neutral text-base">
                BEYLER NESİNE PARA DAĞITIYOR
              </span>
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Notification;
