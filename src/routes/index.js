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
router.use("/decks", errorMiddleware, deckRoute);
router.use("/cards", errorMiddleware, cardsRoute);
router.use("/images", errorMiddleware, imageRoute);
router.use("/events", errorMiddleware, eventRoute);
router.use("/events-users",auth, errorMiddleware, eventUserRoute);
router.use("/foros",auth, errorMiddleware, foroRoute);
router.use("/custom-cards", errorMiddleware, customCardsRoute);


export default router;
