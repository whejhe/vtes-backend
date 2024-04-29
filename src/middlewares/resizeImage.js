import sharp from "sharp";
import path from "path";
import fs from "fs";

const resizeImage = async (req, res, next) => {
    if (!req.file) {
        console.log('No se proporcionó una imagen');
        return next();
    }
    try {
        // Redimensionar la imagen a un tamaño estándar de naipes americanos (2.5 x 3.5 pulgadas)
        const width = 375; // 2.5 pulgadas a 150 dpi
        const height = 525; // 3.5 pulgadas a 150 dpi
        const tempFilePath = path.join(path.dirname(req.file.path), `temp-${path.basename(req.file.path)}`);

        // Crear una copia temporal del archivo
        await fs.promises.copyFile(req.file.path, tempFilePath);

        // Redimensionar la imagen y guardar en el archivo temporal
        const resizedImage = await sharp(tempFilePath)
            .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .jpeg({ quality: 80 })
            .toBuffer();

        // Reemplazar el archivo original con la copia redimensionada
        await fs.promises.unlink(req.file.path);
        await fs.promises.writeFile(req.file.path, resizedImage);

        // Eliminar el archivo temporal
        await fs.promises.unlink(tempFilePath);

        next();
    } catch (error) {
        console.log('Error al redimensionar la imagen: ', error);
        next(error);
    }
};

export default resizeImage;
