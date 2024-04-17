import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authemticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    
    if(!bearer) {
        const error = new Error('No autorizado');
        return res.status(401).json({ error: error.message });
    }

    const token = bearer.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id);
            console.log(user)
        } 
    } catch (error) {
        res.status(500).json({ error: 'Token no válido' });
    }
    
    next();
}   