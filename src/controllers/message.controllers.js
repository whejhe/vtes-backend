// // Importa el modelo de Message
// import Message from "../models/message.model.js";

// // Crear un nuevo mensaje
// const createMessage = async (req, res) => {
//     try {
//         const { postId, userId, content } = req.body;
//         const newMessage = new Message({ postId, userId, content });
//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtener todos los mensajes
// const getMessages = async (req, res) => {
//     try {
//         const messages = await Message.find();
//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtener un mensaje por ID
// const getMessageById = async (req, res) => {
//     try {
//         const message = await Message.findById(req.params.id);
//         if (!message) {
//             return res.status(404).json({ error: "Mensaje no encontrado" });
//         }
//         res.status(200).json(message);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtener un mensaje por User ID
// const getMessagesByUserId = async (req, res) => {
//     try {
//         const messages = await Message.find({ userId: req.params.id });
//         if (!messages) {
//             return res.status(404).json({ error: "Mensajes no encontrado" });
//         }
//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Actualizar un mensaje por ID
// const updateMessage = async (req, res) => {
//     try {
//         const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!message) {
//             return res.status(404).json({ error: "Mensaje no encontrado" });
//         }
//         res.status(200).json(message);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Eliminar un mensaje por ID
// const deleteMessage = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const message = await Message.findByIdAndDelete(id);
//         if (!message) {
//             return res.status(404).json({ error: "Mensaje no encontrado" });
//         }
//         res.status(200).json({ message: "Mensaje eliminado correctamente" });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// const messageControllers = {
//     createMessage,
//     getMessages,
//     getMessageById,
//     getMessagesByUserId, 
//     updateMessage,
//     deleteMessage
// };

// export default messageControllers;