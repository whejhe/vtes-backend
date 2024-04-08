//backend/src/controllers/user.controller.js
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import multerMiddleware from "../middlewares/multer.middleware.js";

dotenv.config();

    // // Iniciar sesión de usuario
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ error: "El usuario no existe" });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: "Contraseña incorrecta" });
//         }
//         res.status(200).json(jwt.sign({
//             _id: user._id,
//             username: user.nick
//         }, process.env.JWT_SECRET, { expiresIn: '1h' }));
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


// // Registrar un nuevo usuario
// const registerUser = async (req, res) => {
//     try {
//         console.log("creando usuario ::: ", req.body);
//         const { name, nick, email, password, role } = req.body;
//         const { file } = req;

//         // Verificar si el usuario ya existe
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "El usuario ya existe" });
//         }

//         // Crear un nuevo usuario
//         const newUser = new User({ name, nick, email, password: await bcrypt.hash(password, 10), role, profileImage: file ? file.filename : "default-avatar.png" });
//         // const newUser = new User({ name, nick, email, password, role, profileImage: file ? file.filename : "default-avatar.png" });
//         await newUser.save();

//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
// Iniciar sesión de usuario
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "El usuario no existe" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        // Aquí puedes devolver los datos del usuario sin token
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    try {
        console.log("creando usuario ::: ", req.body);
        const { name, nick, email, password, role } = req.body;
        const { file } = req;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        // Crear un nuevo usuario
        const newUser = new User({ name, nick, email, password: await bcrypt.hash(password, 10), role, profileImage: file ? file.filename : "default-avatar.png" });
        await newUser.save();

        // Aquí puedes devolver los datos del usuario recién creado sin token
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Buscar el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // Generar un token de recuperación
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // Enviar el correo de recuperación
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Recuperación de contraseña",
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Se ha enviado un correo de recuperación" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Crear un usuario
const createUser = async (req, res) => {
    try {
        // Verificar si el usuario tiene permisos de administrador
        if (!req.user.permissions.includes('editUserRoles')) {
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

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    try {

        // console.log('holaaaa', req.user.permissions, 'aqui 2 \n');
        // Verificar si el usuario tiene permisos de administrador
        if (!req.user.role === 'ADMIN' ) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
        const { file} = req;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        user.profileImage = file ? file.filename : user.profileImage;
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
    updateProfileImage
};

export default userControllers;