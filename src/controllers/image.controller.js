// Importa el modelo de Image
import Image from "../models/image.model.js";
import User  from "../models/user.models.js";

// Crear una nueva imagen
const createImage = async (req, res) => {
    try {
        const { userId,customCardId, name, type,extension, publico } = req.body;
        console.log('Req body ==> ', req.protocol);
        //Ruta para la imagen
        const imageUrl =  req.protocol + '://' + req.get('host') + `/vtes-backend/uploads/${type}/${name}${extension}`;
        const newImage = new Image({ userId, customCardId, name, type, imageUrl ,extension, publico });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las imágenes
const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener una imagen por ID
const getImageById = async (req, res) => {
    try {
        const image = await Image.findById({_id:req.params.id});
        if (!image) {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las imagenes de un usuario
const getImagesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const images = await Image.find({ userId });
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Obtener Imagen por nombre
const getImageByName = async (req, res) => {
    try {
        const { name } = req.params;
        const image = await Image.findOne({ name });
        if (!image) {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar una imagen por ID
const updateImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!image) {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una imagen por ID
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findByIdAndDelete(id);
        if (!image) {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
        res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const imageControllers = {
    createImage,
    getImages,
    getImageByName,
    getImageById,
    getImagesByUserId,
    updateImage,
    deleteImage
};

export default imageControllers;