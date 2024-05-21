//backend/src/models/user.models.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from "../service/mongoDB.js";

const { Schema } = mongoose;


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
const passwordRegex = /^.{6,}$/;


// userSchema.pre('save', async function(next) {
//     try {
//         // Comprobar si el email ya existe
//         const existingUser = await User.findOne({ email: this.email });
//         if (existingUser) {
//             throw new Error('El email ya está registrado');
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

const userSchema = new Schema({
    _id:{
        type: String,
        default: uuidv4     
    },
    role:{
        type: String,
        enum: ["SUPER_ADMIN","ADMIN", "USER","COLLABORATOR"],
        default: "USER"
    },
    name:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [30, 'El nombre debe tener un maximo de 30 caracteres'],
    },
    nick:{
        type: String,
        unique: true,
        required: [true, 'El nick de usuario es obligatorio'],
        minlength: [3, 'El nick debe tener al menos 3 caracteres'],
        maxlength: [30, 'El nick debe tener un maximo de 20 caracteres'],
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'El email es obligatorio'],
        validate: {
            validator: (v) => emailRegex.test(v),
            message: 'El email no es valido'
        }
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        validate:{
            validator: (v) => passwordRegex.test(v),
            message: 'La contraseña debe contener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial de entre !@#$%^&*'
        }
    },
    confirmPassword:{
        type: String,
        validate:{
            validator: function(v) {
                return v === this.password;
            },
            message: 'Las contraseñas no coinciden'
        }
    },
    profileImage:{
        type: String,
        default: "default-avatar.png",
        trim: true,
    },
    avatarUrl:{
        type: String,
        // default: "/vtes-backend/uploads/avatars/default-avatar.png",
        trim: true,
    },
    blocked:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
    autoCreate: false
});

const User = connectDB.model('User', userSchema);

export default User;
