import { GoTrash } from "react-icons/go";
import PageHeading from "../../components/ui/PageHeading";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NotificationType } from "../../utils/types";
import Notification from "../../components/ui/Notification";
import { v4 as uuidv4 } from 'uuid';

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const {data: notifications, isPending: isNotificationsLoading} = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/notification`, {method: "GET"});
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while deleting notifications.");
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  const {mutate: deleteAllNotifications, isPending: isNotificationsDeleting} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/notification`, {method: "DELETE"});
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred while deleting notifications.");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], []);
      toast.success("All notifications deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const handleDeleteNotifications = () => {
    if (notifications.length === 0) return;
    if (isNotificationsDeleting) return;
    deleteAllNotifications();
  };

  return (
    <>
      <PageHeading
        title="Notifications"
        subtitle="All your notifications in one place."
        headerMobile={false}
      >
        {notifications?.length > 0 &&
        <Modal
          modalName="delete-notifications"
          trigger={
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => {
                const modal = document.getElementById(
                  "delete-notifications"
                ) as HTMLDialogElement | null;
                modal?.showModal();
              }}
              title="Delete All Notifications"
              type="button"
            >
              <GoTrash
                title="Delete All Notifications"
                className="w-[1.3em] h-[1.em]"
              />
            </button>
          }
        >
          <div className="p-4">
            <h3 className="font-bold text-lg">Delete All Notifications</h3>
            <p className="py-4">
              Are you sure you want to delete all notifications? This action
              cannot be undone, and you will lose all your notification history
              permanently.
            </p>
            <button
              className="btn btn-outline btn-error"
              onClick={handleDeleteNotifications}
              type="button"
            >
              Yes, delete them
            </button>
          </div>
        </Modal>
        }
      </PageHeading>
      <div className="flex flex-col justify-center items-center w-full h-fit">
        {isNotificationsLoading && <LoadingSpinner size="lg" className="my-4" />}
        {!isNotificationsLoading &&
          notifications.map((notification: NotificationType) => {
            return (
              <Notification key={uuidv4()} notification={notification} />
            );
          })}
      </div>
    </>
  );
};

export default NotificationPage;
