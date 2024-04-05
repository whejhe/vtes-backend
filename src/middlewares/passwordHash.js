//backend/src/middlewares/passwordHash.js
import bcrypt from 'bcrypt';

export const passwordHash = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        // console.log(req.body.password);
        const hash = await bcrypt.hash(req.body.password, salt);
        // console.log(hash);
        req.body.password = hash;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}