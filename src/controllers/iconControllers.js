//backend/src/controllers/iconControllers.js
import Icons from "../models/icon.model.js";

// Guardar Iconos
const createIcon = async (req, res) => {
    try {
        const { type, isDiscipline, name, extension } = req.body;
        const url = `/uploads/icons/${type}/${name}.${extension}`;
        const newIcon = new Icons({ type, isDiscipline, name, url, extension });
        await newIcon.save();
        res.status(201).json(newIcon);
    }catch(error){
        console.log('Error al crear el icono: ', error);
        res.status(400).json({error: 'Error al crear el icono'})
    }
}

const getIcons = async (req, res) => {
    try {
        const icons = await Icons.find();
        res.status(200).json(icons);
    }catch(error){
        console.log('Error al obtener los iconos: ', error);
        res.status(400).json({error: 'Error al obtener los iconos'})
    }
}

const getIconsByType = async (req, res) => {
    try {
        const { type } = req.body;
        const icons = await Icons.find({ type });
        // console.log('Tipo: ', type)
        res.status(200).json(icons);
    }catch(error){
        console.log('Error al obtener los iconos: ', error);
        res.status(400).json({error: 'Error al obtener los iconos'})
    }
}

const getIconByName = async (req, res) => {
    try {
        const { name } = req.body;
        const icons = await Icons.find({ name });
        res.status(200).json(icons);
    }catch(error){
        console.log('Error al obtener el icono: ', error);
        res.status(400).json({error: 'Error al obtener el icono'})
    }
}

const updatedIcon = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, isDiscipline, name, extension } = req.body;
        const url = `/uploads/icons/${type}/${name}.${extension}`;
        const updatedIcon = await Icons.findByIdAndUpdate(id, { type, isDiscipline, name, url, extension }, { new: true });
        res.status(200).json(updatedIcon);
    }catch(error){
        console.log('Error al actualizar el icono: ', error);
        res.status(400).json({error: 'Error al actualizar el icono'})
    }
}

const iconControllers = {
    createIcon,
    getIcons,
    getIconsByType,
    getIconByName,
    updatedIcon
}

export default iconControllers;