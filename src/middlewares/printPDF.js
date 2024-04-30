//backend/src/middlewares/printPDF.js
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import Cards from "../models/cards.model.js";
import Deck from "../models/deck.model.js";


export const generateDeckPDF = async (req, res) => {
    try {
        const deckId = req.params.id;
        console.log('Deck ID:', deckId);
        const deck = await Deck.findById(deckId).populate('crypt._id').populate('library._id');
        if (!deck) {
            return res.status(404).json({ error: 'Mazo no encontrado' });
        }

        const cards = await Promise.all(deck.crypt.map(async (card) => {
            const cardData = await Cards.findById(card._id);
            if (cardData && cardData.imageUrl) { 
                return {
                    name: cardData.name,
                    imageUrl: cardData.imageUrl,
                };
            }
        }));

        const libraryCards = await Promise.all(deck.library.map(async (card) => {
            const cardData = await Cards.findById(card._id);
            if (cardData && cardData.imageUrl) { 
                return {
                    name: cardData.name,
                    imageUrl: cardData.imageUrl,
                };
            }
        }));

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = doc.pipe(blobStream());

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

        // Finaliza el documento PDF
        doc.end();

        stream.on('finish', () => {
            const pdfBuffer = stream.toBuffer();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${deck.name}.pdf"`);
            res.send(pdfBuffer);
        });
    } catch (error) {
        console.log('Error: ',error);
        return res.status(400).json({ error: error.message });
    }
};
