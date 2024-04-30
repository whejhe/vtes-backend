//backend/src/middlewares/printPDF.js
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import Cards from "../models/cards.model.js";
import Deck from "../models/deck.model.js";
import path from 'path';
import fs from 'fs';
import got from 'got';

export const generateDeckPDF = async (req, res) => {
    try {
        const deckId = req.params.id;
        console.log('Deck ID:', deckId);
        const deck = await Deck.findById(deckId).populate('crypt._id').populate('library._id');
        if (!deck) {
            return res.status(404).json({ error: 'Mazo no encontrado' });
        }

        const downloadAndSaveImage = async (url) => {
            const __dirname = path.resolve();

            const fileName = path.basename(url);
            console.log(__dirname, 'dirname');
            const filePath = `${__dirname}/uploads/vtesCards/${fileName}`;

            // Verificar si el archivo ya existe
            if (fs.existsSync(filePath)) {
                return filePath;
            }

            // Si el archivo no existe, lo descarga y lo guarda
            const response = await got(url, { responseType: 'buffer' });
            fs.writeFileSync(filePath, response.body);
            return filePath;
        };

        const cards = await Promise.all(deck.crypt.map(async (card) => {
            const cardData = await Cards.findById(card._id);
            if (cardData && cardData.url) {
                const imageUrl = await downloadAndSaveImage(cardData.url, cardData.name);
                return {
                    name: cardData.name,
                    imageUrl: imageUrl,
                };
            }
        }));

        const libraryCards = await Promise.all(deck.library.map(async (card) => {
            const cardData = await Cards.findById(card._id);
            if (cardData && cardData.url) {
                const imageUrl = await downloadAndSaveImage(cardData.url, cardData.name);
                return {
                    name: cardData.name,
                    imageUrl: imageUrl,
                };
            }
        }));

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers = [];

        // Agrega el título del mazo
        doc.fontSize(18).text(`Mazo: ${deck.name}`, { align: 'center' });
        doc.moveDown(2);

        // Agrega las cartas de la cripta
        doc.fontSize(14).text('Cripta:', { underline: true });
        doc.moveDown(1);
        for (const card of cards) {
            doc.image(card.imageUrl, { fit: [100, 150] });
            doc.moveUp(2);
            doc.fontSize(12).text(card.name, { align: 'center' });
            doc.moveDown(3);
        }

        // Agrega las cartas de la biblioteca
        doc.addPage();
        doc.fontSize(14).text('Biblioteca:', { underline: true });
        doc.moveDown(1);
        for (const card of libraryCards) {
            doc.image(card.imageUrl, { fit: [100, 150] });
            doc.moveUp(2);
            doc.fontSize(12).text(card.name, { align: 'center' });
            doc.moveDown(3);
        }

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${deck.name}.pdf"`);
            res.end(pdfData);
        });

        doc.end();
    } catch (error) {
        console.log('Error: ', error);
        return res.status(400).json({ error: error.message });
    }
};
