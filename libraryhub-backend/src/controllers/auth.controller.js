import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";

export const register = async (req, res) => {

    try {

        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email đã tồn tại."
            });
        }

        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await User.create({

            userName,

            email,

            password: hashedPassword

        });

        res.status(201).json({

            message: "Đăng ký thành công.",

            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập email và mật khẩu."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng."
            });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({

            message: "Đăng nhập thành công.",

            accessToken,

            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const profile = async (req,res)=>{

    res.json({

        message:"Thông tin người dùng",

        user:req.user

    });

}