import fs from 'fs';
import path from 'path';
// import Deck from '../models/deck.model';
import Cards from "../models/cards.model.js";

const writeTxt = (req, res,next) => {
    const filepath = path.join(__dirname, '../', 'generated-files', 'print.txt');
    const fileData = `${new Date().toISOString()} - ${req.method} - ${req.Url}\n`;

    if( req.method === 'POST' && req.url === '/decks/print/:id' ){
        const { name, description, category, crypt, library, author } = req.body;
        fileData += `Deck: ${name}\nDescription: ${description}\nCategory: ${category}\nAuthor: ${author}\nCrypt: ${crypt}\nLibrary: ${library}\n`;
        crypt.forEach((element) => {
            Cards.findById(element._id, (err, card) => {
                if(err){
                    console.log(err);
                    return res.status(500).send('Error en el servidor al escribir la cripta en el archivo');
                }else{
                    fileData += `Card: ${card.name} - Quantity: ${element.quantity}\n`;
                }
            });
        });
        library.forEach((element) => {
            Cards.findById(element._id, (err, card) => {
                if(err){
                    console.log(err);
                    return res.status(500).send('Error en el servidor al escribir la libreria en el archivo');
                }else{
                    fileData += `Card: ${card.name} - Quantity: ${element.quantity}\n`;
                }
            });
        });
    }
    fs.appendFile(filepath, fileData, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error en el servidor al escribir el archivo');
        }else{
            console.log('Archivo escrito con exito');
            next();
        }
    });
}

export default writeTxt;