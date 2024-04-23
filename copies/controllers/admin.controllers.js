import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

//Iniciar sesion como Admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        try{
            const user = await User.findOne({ email });
            if(!user){
                return res.status(401).json({ error: "El usuario no existe" });
            }
            if(user.role !== 'ADMIN'){
                return res.status(403).json({ error: 'Acceso denegado' });
            }
        }catch(error){
            res.status(400).json({ error: error.message });
        }
        console.log('Request', req.body)
        console.log('Email: ', email, 'Password: ', password);
        // Buscar el usuario por email y contraseña
        const user = await User.findOne({ email });
        console.log('Usuario encontrado: ', user);
        if (!user) {
            return res.status(401).json({ error: "El usuario no existe" });
        } else if (user.password !== password) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        res.status(200).json(jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, { expiresIn: '1h' }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const cambiarPermisos = async (req, res) => {
    try{
        const { email, newRole } = req.body;
        const currenUser = await User.finById(req.user._id);
        if(!currenUser){
            return res.status(401).json({ error: "El usuario no existe" });
        }
        if(currenUser.role !== 'ADMIN'){
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const userToChange = await User.findOne({ email });
        if(!userToChange){
            return res.status(401).json({ error: "El usuario no existe" });
        }
        //Actualizar rol
        userToChange.role = newRole;
        await userToChange.save();
        res.status(200).json({ message: 'Rol cambiado correctamente' });
    }catch(error){
        console.log('Error al cambiar el rol del Usuario: ',error);
        res.status(400).json({ error: error.message });
    }
};

const adminControllers = {
    loginAdmin,
    cambiarPermisos
};
export default adminControllers;



