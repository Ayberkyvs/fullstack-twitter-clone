import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';

export const signup = async (req,res) => {
    try {
        const { username, fullName, email, password } = req.body;
        if (password.length < 6) {
            return res.status(400).json({error: 'Password must be at least 6 characters long'})
        }
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }
        const existingUser = await User.findOne({ username })
        const existingEmail = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({error: 'Username already exists'});
        }else if (existingEmail) {
            return res.status(400).json({error: 'Email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        })

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

        if (!username || !password) {
            return res.status(400).json({error: 'Please fill in all fields'});
        }

        const user = await User.findOne({username});
        const isMatch = await bcrypt.compare(password, user?.password || "");

        if (!user || !isMatch) {
            return res.status(400).json({error: 'Invalid username or password'});
        }

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
export const authCheck = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in authCheck contoller: "+ error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}