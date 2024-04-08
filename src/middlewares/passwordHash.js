// backend/src/middlewares/passwordHash.js
import bcrypt from 'bcrypt';

export const passwordHash = async (req, res, next) => {
    if(!req.body.password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export const isPasswordValid = async (req, res, next) => {
    try {
        const isMatch = await bcrypt.compare(req.body.password, req.user.password);
        if (!isMatch) {
            console.error('Invalid password');
            return res.status(401).json({ error: 'Invalid password' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
