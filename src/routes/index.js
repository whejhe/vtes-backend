//src/routes/index.js
import { Router } from "express";
const router = Router();

import userRouter from "./user.router.js";
import post from "./post.router.js";
import message from "./message.router.js";
import libraryRouter from "./library.router.js";
import imageRoute from "./image.router.js";
import foroRoute from "./foro.router.js";
import eventRoute from "./event.router.js";
import eventUserRoute from "./event-users.router.js";
import deckRoute from "./deck.router.js";
import customCardsRoute from "./customCardsRouter.js";
import cardsRoute from "./cards.router.js";
import adminRoute from "./admin.route.js";
import { auth } from "../middlewares/auth.js";
import { errorMiddleware } from "../middlewares/error.js";

router.use("/users", errorMiddleware, userRouter);
router.use("/admin",auth, errorMiddleware, adminRoute);
router.use("/users/posts",auth, errorMiddleware, post);
router.use("/users/messages",auth, errorMiddleware, message);
router.use("/users/libraries",auth, errorMiddleware, libraryRouter);
router.use("/users/libraries/decks",auth, errorMiddleware, deckRoute);
router.use("/users/libraries/decks/cards",auth, errorMiddleware, cardsRoute);
router.use("/",auth, errorMiddleware, eventRoute);
router.use("/",auth, errorMiddleware, eventUserRoute);
router.use("/",auth, errorMiddleware, imageRoute);
router.use("/",auth, errorMiddleware, foroRoute);
router.use("/",auth, errorMiddleware, customCardsRoute);


export default router;
