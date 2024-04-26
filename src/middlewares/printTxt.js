import fs from 'fs';
import path from 'path';
import Cards from "../models/cards.model.js";
import Deck from "../models/deck.model.js";


export const printTxt = async (req, res, next) => {
    const deckId = req.params.id;
    const deck = await Deck.findById(deckId).populate('crypt._id').populate('library._id');
    if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
    }
    let filename = deck.name + '-'+ deck.author +'.txt';
    const __dirname = path.resolve();
    const filepath = path.join(__dirname, 'public', 'archivosTxt', filename);

    let fileData = '';

    const { name, description, category, crypt, library, author } = deck;
    fileData += `Deck: ${name}\n------------------------------------------------ \nDescription: ${description}\nCategory: ${category}\nAuthor: ${author}\n------------------------------------------------\n`;
    // Crypt: ${crypt}\nLibrary: ${library}\n`;
    // console.log('Datos guardados: ', fileData);
    try {
        fileData += "Crypt:\n";
        for (const id of crypt) {
            const card = await Cards.findById(id._id);
            fileData += `- ${card.name}, Clan: ${card.clans}, Disciplinas: ${card.disciplines}, Quantity: ${id.quantity}\n`;
        }

        fileData += "------------------------------------------------\nLibrary:\n";
        for (const id of library) {
            const card = await Cards.findById(id._id);
            let string = `- ${card.name}, `
            card.clans.length > 0 ? string = string.concat(`Clan(es): ${card.clans}, `) : null
            card.disciplines.length > 0 ? string = string.concat(`Disciplina(s): ${card.disciplines}, `) : null
            string = string.concat(`Quantity: ${id.quantity}\n`);
            fileData += string;
        }

        fileData += `------------------------------------------------\nTotal Cards: ${library.length + crypt.length}`
        fs.writeFile(filepath, fileData, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error en el servidor al escribir el archivo');
            } else {
                console.log(filepath)
                console.log('Archivo escrito con exito');
                
                res.download(filepath)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor al escribir el archivo.txt');
    }
}
