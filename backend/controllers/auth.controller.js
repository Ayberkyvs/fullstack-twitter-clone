import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import { createHashedPassword } from '../lib/utils/createHashedPassword.js';
import { isUsernameAndEmailValid } from '../lib/utils/isUsernameAndEmailValid.js';

export const signup = async (req,res) => {
    try {
        const { username, fullName, email, password } = req.body;
        if (password.length < 6) return res.status(400).json({error: 'Password must be at least 6 characters long'})

        const isValid = await isUsernameAndEmailValid(username, email);

        if (isValid.username) return res.status(400).json({error: isValid.username});
        else if (isValid.email) return res.status(400).json({error: isValid.email});

        const hashedPassword = await createHashedPassword(password);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                username: newUser.username,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        }else{
            res.status(400).json({error: 'Invalid user data'});
        }
    } catch (error) {
        console.error("Error in signup contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
export const login = async (req,res)=>{
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({error: 'Please fill in all fields'});

        const user = await User.findOne({ username }).select('+password');
        const isMatch = await bcrypt.compare(password, user?.password || "");

        if (!user || !isMatch) return res.status(400).json({error: 'Invalid username or password'});

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });

    } catch (error) {
        console.error("Error in login contoller:"+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.error("Error in logout contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
export const getMe = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in authCheck contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}