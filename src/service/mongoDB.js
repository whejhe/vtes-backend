//backend/src/service/mongoDB.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URL;

export let connectDB = null; 
try {
  mongoose.set('strictQuery', false);
  
  connectDB = mongoose.createConnection(uri)
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
}
