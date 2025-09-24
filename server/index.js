import express from "express";
import dotenv from "dotenv";
dotenv.config()
import connectDB from "./App/config/db.js";
import authRouter from "./App/routes/auth.route.js";
import userRouter from "./App/routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

connectDB();


const port = process.env.PORT||5000;
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})