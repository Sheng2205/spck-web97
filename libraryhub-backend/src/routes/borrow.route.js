import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
    borrowBook,
    returnBook,
    getMyBorrowedBooks,
    getAllBorrowRecords
} from "../controllers/borrow.controller.js";

const router = express.Router();

// User
router.post("/", authMiddleware, borrowBook);

router.get("/my-books", authMiddleware, getMyBorrowedBooks);

router.put("/return/:id", authMiddleware, returnBook);

// Admin
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    getAllBorrowRecords
);

export default router;