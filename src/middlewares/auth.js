//src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('llegando', token)
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate. testing' });
    }
    try {        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password -__v');
        console.log(user, token, 'desde auth middleware')
        if (!user) {
            throw new Error();
        }
        req.token = decoded;
        req.user = user;
        next();
    } catch (e) {
        console.log(e)
        res.status(401).send({ error: 'Please authenticate.' });
    }
}
