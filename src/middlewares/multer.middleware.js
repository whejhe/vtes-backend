//backend/src/middlewares/multer.middleware.js
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determinar la carpeta de destino según la ruta
        console.log(req.path, '\n aqui')
        if (req.path === '/register') {
            cb(null, path.join(__dirname, "/uploads/avatars"));
        } else if (req.path.startsWith('/customCards')) {
            cb(null, path.join(__dirname, "/uploads"));
        } else {
            cb(null, path.join(__dirname, "/uploads"));
        }
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const multerMiddleware = multer({ storage })

export default multerMiddleware;
