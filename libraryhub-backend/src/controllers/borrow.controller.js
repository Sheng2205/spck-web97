import Borrow from "../models/borrow.model.js";
import Book from "../models/book.model.js";

export const borrowBook = async (req, res) => {
    try {

        const { bookId, dueDate } = req.body;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sách."
            });
        }

        if (book.available <= 0) {
            return res.status(400).json({
                success: false,
                message: "Sách đã hết."
            });
        }

        const borrow = await Borrow.create({
            user: req.user.id,
            book: bookId,
            dueDate
        });

        book.available -= 1;

        await book.save();

        return res.status(201).json({
            success: true,
            message: "Mượn sách thành công.",
            data: borrow
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const returnBook = async (req, res) => {
    try {

        const { id } = req.params;

        const borrow = await Borrow.findById(id);

        if (!borrow) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiếu mượn."
            });
        }

        if (borrow.status === "Returned") {
            return res.status(400).json({
                success: false,
                message: "Sách đã được trả."
            });
        }

        borrow.status = "Returned";
        borrow.returnDate = new Date();

        await borrow.save();

        const book = await Book.findById(borrow.book);

        if (book) {
            book.available += 1;
            await book.save();
        }

        return res.status(200).json({
            success: true,
            message: "Trả sách thành công.",
            data: borrow
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getMyBorrowedBooks = async (req, res) => {
    try {

        const borrows = await Borrow.find({
            user: req.user.id,
            status: "Borrowing"
        })
        .populate("book")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: borrows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllBorrowRecords = async (req, res) => {
    try {

        const borrows = await Borrow.find()
            .populate("user", "userName email")
            .populate("book", "title author")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: borrows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteBorrowHistoryByPeriod = async (req, res) => {
    try {
        const { timeframe, onlyReturned = true } = req.body;
        const query = {};

        if (onlyReturned) {
            query.status = "Returned";
        }

        const now = new Date();

        if (timeframe === "day") {
            const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            query.createdAt = { $gte: past24h };
        } else if (timeframe === "week") {
            const past7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            query.createdAt = { $gte: past7d };
        } else if (timeframe === "month") {
            const past30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            query.createdAt = { $gte: past30d };
        } else if (timeframe === "older_30_days") {
            const past30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            query.createdAt = { $lt: past30d };
        }

        const result = await Borrow.deleteMany(query);

        return res.status(200).json({
            success: true,
            message: `Đã xóa ${result.deletedCount} phiếu mượn/trả.`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteSingleBorrowRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Borrow.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiếu mượn/trả."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa phiếu mượn/trả thành công."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};