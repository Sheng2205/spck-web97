import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Tài khoản không tồn tại."
            });
        }

        req.user = {
            id: user._id.toString(),
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };

        next();

    } catch (error) {

        res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn."
        });

    }

};

export default authMiddleware;