//backend/src/controllers/image.controller.js
import Image from "../models/image.model.js";
import User  from "../models/user.models.js";
import path from "path";

// Añadir Imagen a un usuario
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Eliminar la imagen de perfil anterior
        if (user.profileImage !== "default-avatar.png") {
            await Image.deleteOne({ userId: userId, image: user.profileImage });
        }

        const { name, filename } = req.body;
        const author = req.user.nick;
        const imageUrl = `/uploads/avatars/${filename}`;
        const type = 'private-avatar';

        // Crear una nueva imagen
        const newAvatar = new Image({ userId, name, type, image: filename, imageUrl, author });
        await newAvatar.save();

        // Actualizar el usuario con la nueva imagen de perfil
        user.profileImage = filename;
        user.avatarUrl = imageUrl;
        await user.save();

        res.status(201).json(newAvatar);
    } catch (error) {
        console.log('Error al subir imagen de Avatar: ', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: 'Error al subir la imagen' });
        }
    }
};



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

// Obtener todos los avatares disponibles
const getAvatars = async (req, res) => {
    try {
        const avatars = await Image.find({ type: 'avatars' });
        res.status(200).json(avatars);
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

// Obtener imagen de perfil de usuario
const getAvatarByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const image = await Image.findOne({ userId, type: 'avatars' });
        if (!image) {
            return res.status(404).json({ error: "Imagen no encontrada" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

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
    uploadAvatar,
    createImage,
    getImages,
    getAvatars,
    getAvatarByUserId,
    getImageByName,
    getImageById,
    getImagesByUserId,
    updateImage,
    deleteImage
};

export default imageControllers;