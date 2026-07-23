import User from "../models/user.model.js";

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng."
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findByIdAndUpdate(

            id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        ).select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy người dùng."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Cập nhật thành công.",

            data: user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};