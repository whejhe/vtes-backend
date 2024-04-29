//backend/src/middlewares/multer.middleware.js
import customCard from "../models/customCards.model.js";
import { error } from "console";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determinar la carpeta de destino según la ruta
        if (req.path === '/register') {
            cb(null, path.join(__dirname, "/uploads/avatars"));
        }else if(req.path === '/upload'){
            cb(null, path.join(__dirname, "/uploads/customCards"));
        }else{
            error("No se encontro la ruta");
        }
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        const extension = originalname.substring(originalname.lastIndexOf('.'));
        // Guardar con el nombre asignado mas el author
        const { name } = req.body;
        const { nick } = req.user;
        const filename = `${name}-${nick}${extension}`;
        console.log(req.body, 'raro')
        // const filename = `${Date.now()}${originalname.slice(0, originalname.lastIndexOf('.'))}${extension}`;
        req.body.filename = filename;
        cb(null, filename);
    }
});


const multerMiddleware = multer({ storage }).single("image");

export default multerMiddleware;
