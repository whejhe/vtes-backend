//backend/src/service/mongoDB.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URL;
// const uri = "mongodb+srv://dominguezalacid:Go5pINGCTevTV0tV@vtesdb.gf9nbee.mongodb.net/?retryWrites=true&w=majority&appName=VtesDB";

export let connectDB = null; 
try {
  mongoose.set('strictQuery', false);
  console.log('Conexión exitosa a la base de datos');
  connectDB = mongoose.createConnection(uri)
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
}
