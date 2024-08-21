import express from "express";
import cors from "cors";
import conn from "./db/conn.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

conn();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
