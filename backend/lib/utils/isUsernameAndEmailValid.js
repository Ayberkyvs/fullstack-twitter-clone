import User from '../../models/user.model.js';


export const isUsernameAndEmailValid = async (username, email) => {
    if (!username && !email) return false;
    const errors = {};

    if (username) {
        const usernameError = await existingUsernameChecker(username);
        if (usernameError) errors.username = usernameError.username;
    }

    if (email) {
        const emailError = await checkExistingEmail(email);
        if (emailError) errors.email = emailError.email;
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    return true;
};

const existingUsernameChecker = async (username) => {
    const existingUsername = await User.findOne({username}).select('-password');
    if (existingUsername) return {username: 'Username already exists'};
    return false;
};
const checkExistingEmail = async (email) => {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!emailRegex.test(email)) return {email: 'Invalid email format'};
    const existingEmail = await User.findOne({email}).select('-password');
    if (existingEmail) return {email: 'Email already exists'};
    return false;
};