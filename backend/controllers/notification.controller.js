import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const notifications = await Notification.find({ to: currentUserId })
            .sort({ createdAt: -1 })
            .populate({
                "path": "from",
                "select": "username profileImg",
            });
        await Notification.updateMany({ to: currentUserId, read: false }, { $set: { read: true } }, { multi: true });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error in getNotifications contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
export const deleteNotification = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        await Notification.deleteMany({ to: currentUserId });
        res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
        console.error("Error in deleteNotification contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};