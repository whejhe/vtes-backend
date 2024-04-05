//src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import decodeToken from 'jsonwebtoken/decode.js';
import User from '../models/user.models.js';

export const auth = async (req, res, next) => {
    try {
        
        const token = req.header.authorization
        token.slice(0,6) === 'Bearer' ? token = token.slice(7) : token
        const tokenDecoded = decodeToken(token)
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await User.findOne({ _id: decoded._id});
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
        console.log(e);
    }
}