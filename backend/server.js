import path from "path";
import express from "express";
import dotenv from "dotenv";
import authRoute from "./api/routes/authRoute.js";
import messageRoute from "./api/routes/messageRoute.js";
import userRoute from "./api/routes/userRoute.js";
import connectDatabase from "./config/datastore.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use('/api/message',messageRoute);
app.use('/api/user',userRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDatabase();
  console.log(`Server is running on port ${PORT}`);
});
