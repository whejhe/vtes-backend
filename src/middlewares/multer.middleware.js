//backend/src/middlewares/multer.middleware.js
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: path.join(__dirname, "/uploads"),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const multerMiddleware = multer({ storage }).single("image");

export default multerMiddleware;
