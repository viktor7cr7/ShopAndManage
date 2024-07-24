import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
};

export const verifyJWT = (jwtToken) => {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    return decoded;
};
