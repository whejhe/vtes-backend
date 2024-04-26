import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import Cards from "../models/cards.model.js";
import Deck from '../models/deck.model.js';
import path from 'path';
import fs from 'fs';

// const generateDeckPDF = async (req, res, next) => {
//     const deckId = req.params.id;
//     const deck = await Deck.findById(deckId);
//     if (!deck) {
//         return res.status(404).json({ error: 'Deck not found' });
//     }
//     try {
//         const cardsPerPage = 9;
//         const numPages = Math.ceil(deck.cards.length / cardsPerPage);

//         // Crear un nuevo documento PDF
//         const doc = new PDFDocument();
//         const stream = doc.pipe(blobStream());
//         const __dirname = path.resolve();

//         doc.pipe(fs.createWriteStream(__dirname + `public/archivosPDF/${deck.name}.pdf`));
//         doc.pipe(res);

//         // Configurar el tamaño de la página para cartas estándar (2.5 x 3.5 pulgadas)
//         const cardWidth = 2.5 * 72; // Convertir pulgadas a puntos (1 pulgada = 72 puntos)
//         const cardHeight = 3.5 * 72;

//         // Iterar sobre las cartas y añadirlas al PDF con líneas de corte
//         deck.cards.forEach((card, index) => {
//             if (index % cardsPerPage === 0) {
//                 doc.addPage();
//             }

//             const x = (index % 3) * (cardWidth + 20) + 20;
//             const y = Math.floor(index / 3) * (cardHeight + 20) + 20;

//             // Añadir la imagen de la carta
//             doc.image(card.image, x, y, { width: cardWidth, height: cardHeight });

//             // Añadir líneas de corte
//             doc.rect(x, y, cardWidth, cardHeight).stroke();
//         });

//         doc.end();
//         stream.on('finish', () => {
//             const url = stream.toBlobURL('application/pdf');
//             iframe.src = url;
//             console.log(url);
//         })
//     }catch (error) {
//         console.log(error);
//         return res.status(500).send('Error en el servidor al escribir el archivo.pdf');
//     }
// };

// export default generateDeckPDF; 

export function buildPDF(req, res) {
    try {
        const doc = new PDFDocument();

        doc.on("data", req);
        doc.on("end", res);

        doc.text("Hello World");

        doc.end();
    } catch (error) {
        res.status(500).send('Error en el servidor al escribir el archivo.pdf');
        console.log('Error en el servidor al escribir el archivo.pdf: ', error);
    }
}
