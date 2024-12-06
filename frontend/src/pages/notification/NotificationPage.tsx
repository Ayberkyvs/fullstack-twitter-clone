import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import { GoBell } from "react-icons/go";
import { NOTIFICATIONS } from "../../utils/db/dummy";
import PageHeading from "../../components/ui/PageHeading";

const NotificationPage = () => {
  const getNotificationMessage = (type: string) => {
    switch (type) {
      case 'like':
        return 'liked your post.';
      case 'follow':
        return 'started following you.';
      case 'comment':
        return 'commented on your post.';
      case 'retweet':
        return 'retweeted your post.';
      default:
        return 'did something.';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FcLike className="fill-error w-full h-full"/>;
      case 'follow':
        return <RiUserFollowFill className="fill-primary w-full h-full"/>;
      case 'comment':
        return <FaComment className="fill-info w-full h-full"/>;
      case 'retweet':
        return <AiOutlineRetweet className="fill-success w-full h-full"/>;
      default:
        return <GoBell className="fill-warning" />;
    }
  };

  return (
    <>
    <PageHeading title="Notifications"/>
      <div className="w-full h-fit">
      {NOTIFICATIONS.map((notification, index) => {
        return (
        <div className="text-base-content p-6 w-full mx-auto border-b border-base-content/10" key={index}>
        <div className="flex items-start gap-3">
          {/* Sol taraftaki ikon */}
          <div className="w-6 h-6">
            {getNotificationIcon(notification.type)}
          </div>
          {/* Profil resmi ve içerik */}
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              {/* Profil Bilgisi */}
              <div className="flex flex-col items-start gap-3">
                <img
                  src="https://avatar.iran.liara.run/public"
                  alt="Fener Shadow"
                  className="w-8 h-8 rounded-full"
                />
                <h3 className="font-bold text-base">Fener Shadow <span className="font-normal">{getNotificationMessage(notification.type)}</span></h3>
              </div>
            </div>
            {/* Tweet Metni */}
            {notification.type === "comment" && (
            <p className="mt-2 text-sm">
              <span className="text-neutral text-base">BEYLER NESİNE PARA DAĞITIYOR</span>
            </p>
            )}
          </div>
        </div>
      </div>
      )})}
    </div>
  </>
  );
};

export default NotificationPage;


