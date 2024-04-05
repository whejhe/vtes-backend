// Importa el modelo de Post
import  Post  from "../models/post.model.js";

// Crear un nuevo post
const createPost = async (req, res) => {
    try {
        const { forumId, authorId, title, content } = req.body;
        const newPost = new Post({ forumId, authorId, title, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Obtener post por usuario ID
const getPostByUserId = async (req, res) => {
    try {
        const post = await Post.find({ authorId: req.params.id });
        if (!post) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// Actualizar un post por ID
const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!post) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un post por ID
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
        res.status(200).json({ message: "Post eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const postControllers = {
    createPost,
    getPosts,
    getPostById,
    getPostByUserId,
    updatePost,
    deletePost
};

export default postControllers;