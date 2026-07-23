import Book from "../models/book.model.js";

export const createBook = async (req, res) => {
    try {

        const {
            title,
            author,
            category,
            description,
            quantity,
            image
        } = req.body;

        if (!title || !author || !category) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin."
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success:false,
                message:"Số lượng sách phải lớn hơn 0."
        });
}

        const existingBook = await Book.findOne({
            title,
            author
        });

        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: "Sách đã tồn tại."
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            description,
            quantity,
            available: quantity,
            image,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Thêm sách thành công.",
            data: book
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllBooks = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search || "";
        const category = req.query.category || "";

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category;
        }

        const totalBooks = await Book.countDocuments(query);

        const books = await Book.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({
                createdAt: -1
            });

        return res.status(200).json({

            success: true,

            totalBooks,

            currentPage: page,

            totalPages: Math.ceil(totalBooks / limit),

            data: books

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const getBookById = async (req, res) => {

    try {

        const { id } = req.params;

        const book = await Book.findById(id).populate(
            "createdBy",
            "userName email"
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sách."
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateBook = async (req, res) => {

    try {

        const { id } = req.params;

        const updatedBook = await Book.findByIdAndUpdate(

            id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!updatedBook) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy sách."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Cập nhật thành công.",

            data: updatedBook

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const deleteBook = async (req, res) => {

    try {

        const { id } = req.params;

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy sách."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Xóa sách thành công."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};