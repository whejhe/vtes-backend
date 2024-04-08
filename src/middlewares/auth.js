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

// export const auth = async (req, res, next) => {
//     try {
        
//         let token = req.headers.authorization
//         console.log(token)
//         token.slice(0,6) === 'Bearer' ? token = token.slice(7) : token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(decoded);
//         const user = await User.findOne({ _id: decoded._id});
//         if (!user) {
//             throw new Error();
//         }
//         req.token = decoded;
//         req.user = user;
//         console.log('Usuario logueado: ',user)
//         next();
//     } catch (e) {
//         res.status(401).send({ error: 'Please authenticate.' });
//         console.log(e);
//     }
// }