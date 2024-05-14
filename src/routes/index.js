//src/routes/index.js
import { Router } from "express";
const router = Router();

import userRouter from "./user.router.js";
import imageRoute from "./image.router.js";
import eventRoute from "./event.router.js";
import eventUserRoute from "./event-users.router.js";
import deckRoute from "./deck.router.js";
import customCardsRoute from "./customCardsRouter.js";
import cardsRoute from "./cards.router.js";
import adminRoute from "./admin.route.js";
import { auth } from "../middlewares/auth.js";
import { errorMiddleware } from "../middlewares/error.js";
import reportRoute from "./report.route.js";

router.use("/users", errorMiddleware, userRouter);
router.use("/admin",auth, errorMiddleware, adminRoute);
router.use("/decks", errorMiddleware, deckRoute);
router.use("/cards", errorMiddleware, cardsRoute);
router.use("/images", errorMiddleware, imageRoute);
router.use("/events", errorMiddleware, eventRoute);
router.use("/events-users",auth, errorMiddleware, eventUserRoute);
router.use("/custom-cards", errorMiddleware, customCardsRoute);
router.use("/report", errorMiddleware, reportRoute);


export default router;
