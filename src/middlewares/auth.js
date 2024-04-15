//src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password -__v');
        if (!user) {
            throw new Error();
        }
        req.token = decoded;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}
