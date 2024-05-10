// backend/src/middlewares/multer.middleware.js
import { error } from "console";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from 'fs';

const __dirname = path.resolve();

const multerMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "/uploads/temp"));
        },
        filename: (req, file, cb) => {
            const { originalname } = file;
            const extension = originalname.substring(originalname.lastIndexOf('.'));
            const { name } = req.body;
            const { nick } = req.user;
            const filename = `${name}-${nick}${extension}`;
            req.body.filename = filename;
            cb(null, filename);
        }
    }),
}).single("image");

const resizeImage = async (req, res, next) => {
    // Modificamos la ruta dependiendo de origen
    let newPath;
    let width;
    let height;
    if (req.path === '/upload') {
        width = 375;
        height = 525;
        newPath = path.join(__dirname, `/uploads/customCards/${req.body.filename}`);
    } else {
        error("No se encontro la ruta");
    }

    // Verificar si se proporcionó una imagen
    if (!req.file) {
        console.log('No se proporcionó una imagen');
        return next();
    }
    try {
        await sharp(req.file.path)
            .resize(width, height)
            .toFile(newPath);

        // Renombrar la imagen original
        const originalPath = path.join(__dirname, "/uploads/temp", req.file.filename);
        const newOriginalPath = path.join(__dirname, "/uploads/temp", "theLastImageUpload" + path.extname(req.file.filename));
        fs.rename(originalPath, newOriginalPath, (err) => {
            if (err) {
                console.log('Error al renombrar la imagen original: ', err);
                return next(err);
            }
            next();
        });
    } catch (error) {
        console.log('Error al redimensionar la imagen: ', error);
        res.status(500).json({ error: 'Error al redimensionar la imagen' });
    }
};

export { multerMiddleware, resizeImage };
