//backend/src/index.js
import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import multerMiddleware from "./middlewares/multer.middleware.js";
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
app.use(cors());

//ROUTES
app.use(routes);

app.use(cors({
    origin: '*'
}));

//MONGODB CONEXION
app.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
    console.log("En el modo: ", process.env.NODE_ENV);
})

app.get('/data', (req, res) => {
    res.send('Datos desde backend');
})

export default app;
