import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import bookRoute from "./src/routes/book.route.js";
import borrowRoute from "./src/routes/borrow.route.js";
import connectDB from "./src/configs/db.js";

dotenv.config();
console.log(process.env.MONGODB_URI);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/borrow", borrowRoute);

app.get("/", (req, res) => {
    res.send("LibraryHub API Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});