//backend/src/middlewares/multer.middleware.js
import { error } from "console";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determinar la carpeta de destino según la ruta
        if (req.path === '/register') {
            cb(null, path.join(__dirname, "/uploads/avatars"));
        }else{
            error("No se encontro la ruta");
        }
    },
    filename: function (req, file, cb) {
        const extension = extname(file.originalname)
        const filename = Date.now() + file.originalname + extension
        req.body.filename = filename
        cb(null, filename)
    }
});

const multerMiddleware = multer({ storage }).single("image");

export default multerMiddleware;
