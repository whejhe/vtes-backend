import { error } from "../middlewares/error.js";
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
            if(user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN'){
                return res.status(403).json({ error: 'Acceso denegado' });
            }
        }catch(error){
            res.status(400).json({ error: error.message });
        }
        
        
        // Buscar el usuario por email y contraseña
        const user = await User.findOne({ email });
        
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

        // Validar entrada
        if(!email || !newRole){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const currenUser = await User.findById(req.user._id);
        
        // Comprobar permisos
        if(currenUser.role !== 'ADMIN' && currenUser.role !== 'SUPER_ADMIN'){
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        // Obtener usuario a cambiar
        const userToChange = await User.findOne({ email });
        if(!userToChange){
            return res.status(401).json({ error: "El usuario no existe" });
        }

        // Comprobar si el usuario a cambiar es super administrador
        if(userToChange.role === 'SUPER_ADMIN'){
            return res.status(400).json({ error: 'No puedes cambiar el rol del superadministrador' });
        }
        //Actualizar rol
        userToChange.role = newRole;
        await userToChange.save();

        res.status(200).json({ message: 'Rol cambiado correctamente' });
    }catch(error){
        
        if(error.name === 'CastError'){
            return res.status(401).json({ error: `No se encontro el usuario con ID ${req.user._id}` });
        }
        res.status(400).json({ error: error.message });
    }
};

const adminControllers = {
    loginAdmin,
    cambiarPermisos
};
export default adminControllers;



