import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import { createHashedPassword } from '../lib/utils/createHashedPassword.js';

import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { isUsernameAndEmailValid } from '../lib/utils/isUsernameAndEmailValid.js';


export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select('-password');
        if (!user) return res.status(404).json({error: 'User not found'});
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserProfile controller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const usersFollowedByMe = await User.findById(currentUserId).select('following');
        const usersToExclude = [...(usersFollowedByMe.following || []).map(user => user._id), currentUserId];
        const suggestedUsers = await User.find({_id: {$nin: usersToExclude}}).select('-password').limit(20);
        //! User.find never returns null, it returns an empty array if no users are found
        if (suggestedUsers.length === 0) return res.status(404).json({error: 'No users found'});
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error("Error in getSuggestedUsers controller: "+ error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (id === req.user._id.toString()) return res.status(400).json({error: 'You cannot follow/unfollow yourself'});
        const userToModify = await User.findById(id).select('-password');
        const currentUser = await User.findById(req.user._id).select('-password');
        if (!userToModify || !currentUser) return res.status(404).json({error: 'User not found'});
        const isFollowing = currentUser.following.includes(userToModify._id);

        let notification;
        if (isFollowing) {
            await currentUser.updateOne({$pull: {following: userToModify._id}});
            await userToModify.updateOne({$pull: {followers: req.user._id}});

            await Notification.findOneAndDelete({from: req.user._id, to: userToModify._id, type: 'follow'});
            res.status(200).json({message: 'User unfollowed successfully'});
        } else {
            await currentUser.updateOne({$push: {following: userToModify._id}});
            await userToModify.updateOne({$push: {followers: req.user._id}});

            notification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: 'follow',
            });

            console.log(notification);
            await notification.save();
            res.status(200).json({message: 'User followed successfully'});
        }
    } catch (error) {
        console.error("Error in followUnfollowUser controller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const updateUserProfile = async (req, res) => {
    //! 
    const {fullName, username, email, bio, link, currentPassword, newPassword} = req.body;
    let { profileImg, coverImg } = req.body;
    const currentUserId = req.user._id;
    try {
        let user = await User.findById(currentUserId);
        if (!user) return res.status(404).json({error: 'User not found'});
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) return res.status(400).json({error: 'Please provide both current and new password'});
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({error: 'Current password is incorrect'});
            if (newPassword.length < 6) return res.status(400).json({error: 'Password must be at least 6 characters long'});
            user.password = await createHashedPassword(newPassword);
        }

        if (profileImg) {
            if (user.profileImg) {
                const imgUrl = user.profileImg;
                const imgPath = imgUrl.split("/").slice(-2).join("/");
                const imgId = imgPath.split(".")[0];
                await cloudinary.uploader.destroy(imgId);
            }
            const res = await cloudinary.uploader.upload(img, {folder:`${currentUserId}`, format: 'webp', allowed_formats: ["webp", "png", "jpg", "jpeg"], transformation: [{quality: "auto"}, {fetch_format: "auto"}]});
            profileImg = res.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                const imgUrl = user.coverImg;
                const imgPath = imgUrl.split("/").slice(-2).join("/");
                const imgId = imgPath.split(".")[0];
                await cloudinary.uploader.destroy(imgId);
            }
            const res = await cloudinary.uploader.upload(img, {folder:`${currentUserId}`, format: 'webp', allowed_formats: ["webp", "png", "jpg", "jpeg"], transformation: [{quality: "auto"}, {fetch_format: "auto"}]});
            coverImg = res.secure_url;
        }

        if (username){
            const isValid = await isUsernameAndEmailValid(username, null);
            if (isValid.username) return res.status(400).json({error: isValid.username});
        }

        if (email){
            const isValid = await isUsernameAndEmailValid(null, email);
            if (isValid.email) return res.status(400).json({error: isValid.email});
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = "YOU CAN'T HACK ME!";
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in updateUserProfile controller: " + error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};