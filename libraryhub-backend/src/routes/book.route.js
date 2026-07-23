import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from "../controllers/book.controller.js";

const router = express.Router();

// User & Admin
router.get("/", authMiddleware, getAllBooks);
router.get("/:id", authMiddleware, getBookById);

// Chỉ Admin
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    createBook
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    deleteBook
);

export default router;