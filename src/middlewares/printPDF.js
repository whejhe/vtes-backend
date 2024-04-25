import PDFDocument from 'pdfkit';

const generateDeckPDF = (req, res, next) => {
    const deck = req.deck; // Suponiendo que tienes un objeto deck en la solicitud
    const cardsPerPage = 9;
    const numPages = Math.ceil(deck.cards.length / cardsPerPage);

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Configurar el tipo de contenido y la descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=deck-${deck._id}.pdf`);
    doc.pipe(res);

    // Configurar el tamaño de la página para cartas estándar (2.5 x 3.5 pulgadas)
    const cardWidth = 2.5 * 72; // Convertir pulgadas a puntos (1 pulgada = 72 puntos)
    const cardHeight = 3.5 * 72;

    // Iterar sobre las cartas y añadirlas al PDF con líneas de corte
    deck.cards.forEach((card, index) => {
        if (index % cardsPerPage === 0) {
            doc.addPage();
        }

        const x = (index % 3) * (cardWidth + 20) + 20; // Ajustar el espaciado
        const y = Math.floor(index / 3) * (cardHeight + 20) + 20;

        // Añadir la imagen de la carta
        doc.image(card.image, x, y, { width: cardWidth, height: cardHeight });

        // Añadir líneas de corte
        doc.rect(x, y, cardWidth, cardHeight).stroke();
    });

    doc.end();
};

export default generateDeckPDF; 
