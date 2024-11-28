import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (uid, res) => {
    const jwtExpireDays = process.env.JWT_EXPIRE
    const days = Number(jwtExpireDays.replace('d', ''));

    const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
        expiresIn: jwtExpireDays,
    });

    res.cookie("jwt",token, {
        httpOnly: true, // to disable access from client side (prevent xss attack)
        secure: process.env.NODE_ENV === 'production',
        maxAge: days * 24 * 60 * 60 * 1000, // ms
        sameSite: 'Strict' // CSRF attacks cross-site request forgery attacks
    })
};