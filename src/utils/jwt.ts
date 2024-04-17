import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type UserPayload = {
    id: Types.ObjectId;
}

export const genrateJWT = (payload : UserPayload) => {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '12h'
    });

    return token;
}