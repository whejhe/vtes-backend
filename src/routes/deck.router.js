//backend/src/routes/deck.router.js
import express from 'express';
import { deckControllers } from '../controllers/index.js';
import { auth } from "../middlewares/auth.js";
import {printTxt} from '../middlewares/printTxt.js';
import { deckCheck } from '../middlewares/deckCheck.js';
import {generateDeckPDF} from '../middlewares/printPDF.js';


const router = express.Router();

const { createDeck, getDecks ,getDeckById, getCardsByDeckId, getDecksByUserId, updateDeck ,updateDeckVisibility, addCardToDeck, deleteDeck, printtoPDF } = deckControllers;

// Rutas para la entidad Deck
router.get('/', getDecks);
router.post('/',auth, createDeck);
router.get('/:id', getDeckById);
router.get('/:id/cards', getCardsByDeckId);
router.get('/:userId', getDecksByUserId);
router.put('/:id',auth, updateDeck);
router.put('/:id/visibility',auth, updateDeckVisibility);
router.put('/add-card/:id', addCardToDeck);
router.delete('/:id',auth, deleteDeck);
router.post('/printTxt/:id',deckCheck, printTxt);
router.get('/printPDF/:id',deckCheck,generateDeckPDF);
// router.get('/printPDF/:id',(req, res) => {
//     const stream = res.writeHead(200, {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'attachment; filename="deck.pdf"',
//     })
//     buildPDF((data) => {
//         stream.write(data),
//         () => stream.end()
//     });
//     res.send('PDF creado con éxito');
// });

export default router;