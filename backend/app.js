import express from "express";

import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.router.js";
import postRoutes from "./routes/post.router.js";
import cookieParser from "cookie-parser";

const app=express();

//Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
//Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

import commentRoutes from './routes/comment.route.js'
app.use('/api/comments', commentRoutes)

export {app}