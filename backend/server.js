import path from "path";
import express from "express";
import dotenv from "dotenv";
import authRoute from "./api/routes/authRoute.js";
import messageRoute from "./api/routes/messageRoute.js";
import userRoute from "./api/routes/userRoute.js";
import fileRoute from "./api/routes/fileRoute.js";
import connectDatabase from "./config/datastore.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import {initializeCronJobs} from "./api/utils/initializeCron.js";
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
app.use('/api/file',fileRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

import fs from "fs";
// Make directory if it does not exist
if (!fs.existsSync(process.env.STATIC_FOLDER + process.env.STATIC_TEMP_PATH)) {
  fs.mkdirSync(process.env.STATIC_FOLDER + process.env.STATIC_TEMP_PATH, {
    recursive: true,
  });
}

if (!fs.existsSync(process.env.STATIC_FOLDER + '/uploads')) {
  fs.mkdirSync(process.env.STATIC_FOLDER + '/uploads', {
    recursive: true,
  });
}

app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

server.listen(PORT, () => {
  connectDatabase();
  initializeCronJobs()
  console.log(`Server is running on port ${PORT}`);
});
