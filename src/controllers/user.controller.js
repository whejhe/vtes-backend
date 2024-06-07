//backend/src/controllers/user.controller.js
import User from "../models/user.models.js";
import Event from '../models/event.model.js';
import EventUsers from '../models/event-users.model.js';
import CustomCards from '../models/customCards.model.js';
import Deck from '../models/deck.model.js';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();

const url = process.env.URL || 'https://localhost';


// Iniciar sesión de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "El usuario no existe" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        delete user.password;
        let user2 = await User.findOne({ email }).select("-password");

        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                nick: user.nick,
                email: user.email,
                profileImage: user.profileImage,
                avatarUrl: user.avatarUrl,
                blocked: user.blocked,
            },
            process.env.JWT_SECRET, 
            { expiresIn: "12h" }
        );
        if (!token) {
            return res.status(500).json({ error: "Error al generar el token" });
        }
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ user: user2, token });
    } catch (error) {
        res.status(400).json({ error: 'Error al iniciar sesión', details: error.message });
    }
};


const registerUser = async (req, res) => {
    try {
        let { name, nick, email, password, role, profileImage, avatarUrl } = req.body;
        if (!name || !nick || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (!profileImage) {
            profileImage = "default-avatar.png";
        }
        const NewAvatarUrl = `/uploads/avatars/${profileImage}`;
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya esta en uso por otro usuario' });
        }
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) return res.status(500).json({ error: 'Error al hashear la contraseña' });

        // Crear un nuevo usuario
        const newUser = new User({ name, nick, email, password: hashedPassword, role, profileImage, avatarUrl: NewAvatarUrl });
        await newUser.save();
        if (!newUser) return res.status(500).json({ error: 'Error al registrar el usuario' });

        // Generar el token JWT
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        if (!token) return res.status(500).json({ error: 'Error al generar el token' });

        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser, token: token });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(400).json({ error: 'De produjo un error al registrar el usuario' });
    }
};

const newAvatar = async (req, res) => {
    try {
        const id = req.user && req.user._id;
        if (!id) {
            throw new Error('ID de usuario no definido');
        }

        const user = await User.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const { profileImage } = req.body;
        if (!profileImage) {
            throw new Error('Imagen de perfil no proporcionada');
        }

        user.profileImage = profileImage;
        user.avatarUrl = `/uploads/avatars/${profileImage}`;

        //actualizar token
        const token = jwt.sign({ _id: user._id, avatarUrl: user.avatarUrl }, process.env.JWT_SECRET, { expiresIn: '10h' });
        if (!token) {
            throw new Error('Error al generar el token');
        }
        res.cookie('token', token, { httpOnly: true });

        await user.save();

        res.status(200).json({ message: 'Avatar actualizado correctamente', avatar: user.avatarUrl });
    } catch (error) {

        res.status(400).json({ error: 'Error al actualizar el avatar' });
    }
};




const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }).select("password");
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Recuperación de contraseña",
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
        };
        process.env.EMAIL_PASSWORD && transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Se ha enviado un correo de recuperación" });
    } catch (error) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        res.status(400).json({ error: error.message });
    }
};


// Crear un usuario
const createUser = async (req, res) => {
    try {
        // Verificar si el usuario tiene permisos de administrador
        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const { id, role, name, nick, email, password } = req.body;
        const user = new User({ id, role, name, nick, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Leer todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Leer un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener imagen de perfil de usuario
const getProfileImage = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(user.profileImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Eliminar cuenta del usuario
const darBaja = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email y comparar el email del token con el email del usuario
        const user = await User.findOne({ email });
        if (email !== req.user.email) {
            return res.status(401).json({ error: "El email no coincide" });
        }
        if (!user) {
            return res.status(404).json({ error: "El usuario no existe" });
        }
        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Elimina las customCards creadas por el usuario
        const userCustomCards = await CustomCards.find({ userId: user._id });
        for (const customCard of userCustomCards) {
            await CustomCards.findByIdAndDelete(customCard._id);
        }

        // Elimina los decks creados por el usuario
        const userDecks = await Deck.find({ userId: user._id });
        for (const deck of userDecks) {
            await Deck.findByIdAndDelete(deck._id);
        }

        // Eliminar los eventos creados por el usuario
        const userEvents = await Event.find({ userId: user._id });
        for (const event of userEvents) {
            // Eliminar la entrada en EventUsers correspondiente al evento
            await EventUsers.deleteMany({ eventId: event._id });

            // Eliminar el evento
            await Event.findByIdAndDelete(event._id);
        }

        // Eliminar al usuario de la tabla EventUsers sin eliminar el documento completo
        await EventUsers.updateMany(
            { userId: user._id },
            { $pull: { userId: user._id } }
        );

        // Encontrar todos los eventos en los que el usuario participa
        const events = await Event.find({ 'ranking.userId': user._id });
        for (const event of events) {
            // Eliminar el usuario del ranking del evento
            event.ranking = event.ranking.filter(r => r.userId !== user._id);

            // Eliminar el usuario de las tiradas del evento
            event.tiradas = event.tiradas.filter(t => t.userId !== user._id);

            // Eliminar el usuario de los players en cada mesa
            event.ronda.forEach(ronda => {
                ronda.mesas.forEach(mesa => {
                    mesa.players = mesa.players.filter(player => player.userId !== user._id);
                });
            });

            await event.save();
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: 'Cuenta dada de baja',
        });
    } catch (error) {
        console.error('Error al darte de baja: ', error);
        res.status(500).json({ error: 'Error al darte de baja' });
    }
};


// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    try {
        // Verificar permisos
        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;

        // Buscar el usuario antes de proceder
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Eliminar customCards del usuario
        const userCustomCards = await CustomCards.find({ userId: id });
        for (const customCard of userCustomCards) {
            await CustomCards.findByIdAndDelete(customCard._id);
        }

        // Eliminar decks del usuario
        const userDecks = await Deck.find({ userId: id });
        for (const deck of userDecks) {
            await Deck.findByIdAndDelete(deck._id);
        }

        // Eliminar los eventos creados por el usuario
        const userEvents = await Event.find({ userId: id });
        for (const event of userEvents) {
            // Eliminar la entrada en EventUsers correspondiente al evento
            await EventUsers.deleteMany({ eventId: event._id });

            // Eliminar el evento
            await Event.findByIdAndDelete(event._id);
        }

        // Eliminar al usuario de la tabla EventUsers sin eliminar el documento completo
        await EventUsers.updateMany(
            { userId: id },
            { $pull: { userId: id } }
        );

        // Encontrar todos los eventos en los que el usuario participa
        const events = await Event.find({ 'ranking.userId': id });
        for (const event of events) {
            // Eliminar el usuario del ranking del evento
            event.ranking = event.ranking.filter(r => r.userId !== id);

            // Eliminar el usuario de las tiradas del evento
            event.tiradas = event.tiradas.filter(t => t.userId !== id);

            // Eliminar el usuario de los players en cada mesa
            event.ronda.forEach(ronda => {
                ronda.mesas.forEach(mesa => {
                    mesa.players = mesa.players.filter(player => player.userId !== id);
                });
            });

            await event.save();
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }
};


const blockUser = async (req, res) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'COLLABORATOR' && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { blocked: true });
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario bloqueado correctamente" });
}

const unblockUser = async (req, res) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'COLLABORATOR' && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { blocked: false });
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario desbloqueado correctamente" });
}

// Obtener lista de avatares predeterminados
const getAvatarOptions = async (req, res) => {
    try {
        const avatarOptions = [
            'Avatar-1.jpg',
            'Avatar-2.jpg',
            'Avatar-3.jpg',
            'Avatar-4.jpg',
            'Avatar-5.jpg',
            'Avatar-6.jpg',
            'Avatar-7.jpg',
            'Avatar-8.jpg',
            'Avatar-9.jpg',
            'Avatar-10.jpg',
            'Avatar-11.jpg',
            'Avatar-12.jpg',
            'Avatar-13.jpg',
            'Avatar-14.jpg',
            'Avatar-15.jpg',
            'Avatar-16.jpg',
            'Avatar-17.jpg',
            'Avatar-18.jpg',
            'Avatar-19.jpg',
            'Avatar-20.jpg',
            'Avatar-21.jpg',
            'Avatar-22.jpg',
            'Avatar-23.jpg',
            'Avatar-24.jpg',
            'Avatar-25.jpg',
            'Avatar-26.jpg',
            'Avatar-27.jpg',
            'Avatar-28.jpg',
            'Avatar-29.jpg',
            'Avatar-30.jpg',
            'Avatar-31.jpg',
            'Avatar-32.jpg',
            'Avatar-33.jpg',
            'Avatar-34.jpg',
            'Avatar-35.jpg',
            'Avatar-36.jpg',
            'Avatar-37.jpg',
            'Avatar-38.jpg',
            'Avatar-39.jpg',
            'Avatar-40.jpg',
            'Avatar-41.jpg',
            'Avatar-42.jpg',
            'Avatar-43.jpg',
            'Avatar-44.jpg',
            'Avatar-45.jpg',
            'Avatar-46.jpg',

        ]
        res.status(200).json(avatarOptions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { file } = req;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        user.profileImage = file ? file.filename : user.profileImage;
        const token = jwt.sign({ _id: user._id, avatarUrl: user.avatarUrl }, process.env.JWT_SECRET, { expiresIn: '10h' });
        if (!token) {
            throw new Error('Error al generar el token');
        }
        res.cookie('token', token, { httpOnly: true });

        await user.save();
        res.status(200).json({ message: "Imagen actualizada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const userControllers = {
    loginUser,
    registerUser,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    forgotPassword,
    getAvatarOptions,
    getProfileImage,
    updateProfileImage,
    blockUser,
    unblockUser,
    newAvatar,
    darBaja
};

export default userControllers;