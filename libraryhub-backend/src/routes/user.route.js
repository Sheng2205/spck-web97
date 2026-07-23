import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
    getProfile,
    getAllUsers,
    updateUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    getAllUsers
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    updateUser
);

// router.get(
//     "/admin-test",
//     authMiddleware,
//     roleMiddleware("Admin"),
//     (req, res) => {

//         res.json({
//             message: "Bạn là Admin, có quyền truy cập."
//         });

//     }
// );

export default router;