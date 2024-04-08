//backend/src/middlewares/passwordHash.js
import bcrypt from 'bcrypt';

export const passwordHash = (req, res, next) => {
    if(!req.body.password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            req.body.password = hash;
            next();
        });
    });
}

export const isPasswordValid = (req, res, next) => {
    bcrypt.compare(req.body.password, req.user.password, (err, isMatch) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (!isMatch) {
            console.error('Invalid password');
            return res.status(401).json({ error: 'Invalid password' });
        }
        next();
    });
}

// export const passwordHash = async (req, res, next) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         console.log(req.body.password);
//         const hash = await bcrypt.hash(req.body.password, salt);
//         console.log(hash);
//         req.body.password = hash;
//         next();
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }