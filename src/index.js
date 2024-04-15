//backend/src/index.js
import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import "./service/mongoDB.js";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env.production' });
}

const __dirname = path.resolve();
const app = express();

//CONFIGURACIONES
app.set("port", process.env.PORT || 3000);

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Configurar rutas de archivos estaticos (imagenes)
app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, "../public/data")));
app.use('/vtes-backend/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/vtes-backend/uploads/avatars', express.static(path.join(__dirname, "uploads/avatars")));
app.use('/vtes-backend/uploads/customCards', express.static(path.join(__dirname, "uploads/customCards")));


//ROUTES
app.use(routes);

//MONGODB CONEXION
app.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
    console.log("En el modo: ", process.env.NODE_ENV);
})

app.get('/', (req, res) => {
    res.send('Backend server running...')
})

// app.get('/vtes.json', (req, res) => {
//     res.sendFile(path.join(__dirname, "../public/data/vtes.json"));
// })

//404
app.use((req, res, next) => {
    res.status(404).send('404 Not found')
});

export default app;
