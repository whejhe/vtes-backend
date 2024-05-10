// // Importa el modelo de Foro
// import Foro from "../models/foro.model.js";
// import User  from "../models/user.models.js";

// // Crear un nuevo foro
// const createForo = async (req, res) => {
//     try {
//         console.log("Crear foro ::: ", req.body);
//         console.log("Crear foro ::: ", req.user);
//         const { userId: id, title, content } = req.body;

//         const userId = req.user?.id ?? id;

//         console.log('userId: ', userId);
//         const newForo = new Foro({ userId, title, content });
//         await newForo.save();
//         res.status(201).json(newForo);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtener todos los foros
// const getForos = async (req, res) => {
//     try {
//         const foros = await Foro.find();
//         res.status(200).json(foros);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtener un foro por ID
// const getForoById = async (req, res) => {
//     try {
//         const foro = await Foro.findById(req.params.id);
//         if (!foro) {
//             return res.status(404).json({ error: "Foro no encontrado" });
//         }
//         res.status(200).json(foro);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Actualizar un foro por ID
// const updateForo = async (req, res) => {
//     try {
//         const foro = await Foro.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!foro) {
//             return res.status(404).json({ error: "Foro no encontrado" });
//         }
//         res.status(200).json(foro);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Eliminar un foro por ID
// const deleteForo = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const foro = await Foro.findByIdAndDelete(id);
//         if (!foro) {
//             return res.status(404).json({ error: "Foro no encontrado" });
//         }
//         res.status(200).json({ message: "Foro eliminado correctamente" });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// const foroControllers = {
//     createForo,
//     getForos,
//     getForoById,
//     updateForo,
//     deleteForo
// };

// export default foroControllers;