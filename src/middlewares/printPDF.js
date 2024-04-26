import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import Cards from "../models/cards.model.js";
import Deck from '../models/deck.model.js';
import path from 'path';
import fs from 'fs';

export const generateDeckPDF = async (req, res, next) => {
    // Definir la informacion del deck
    // try{
    //     const deckId = req.params.id;
    //     const deck = await Deck.findById(deckId).populate('crypt._id').populate('library._id');
    //     if(!deck){
    //         return res.status(404).json({ error: 'Deck no encontrado' });
    //     }
    //     const { url } = deck.Cards.url;
    //     console.log(url);
    // }catch(error){
    //     console.log(error);
    //     return res.status(400).json({ error: error.message });
    // }
    try {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument();
        // Directorio donde se guardara el PDF
        doc.pipe(fs.createWriteStream(`public/archivosPDF/prueba.pdf`));
        // Escribe el encabezado del PDF
        doc.font('Times-Roman');
        doc.fontSize(25);
        doc.text('Deck de cartas', { align: 'center' });

        // Opciones del documento
        options = {
            size: 'A4',
            margins: {
                top: 40,
                bottom: 60,
                left: 40,
                right: 40
            }
        }

        // Añadir Imagenes 
        const stream = doc.pipe(blobStream());
        doc.pipe(res);

        // Finaliza el documento
        doc.end();
        // stream.on('finish', () => {
        //     const blob = stream.toBlob('application/pdf');
        //     const url = stream.toBlobURL('application/pdf');
        //     const iframe = document.getElementById(deck);
        //     iframe.src = url;
        //     res.redirect(url);
        // });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}
