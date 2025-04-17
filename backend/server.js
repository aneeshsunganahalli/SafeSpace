import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.log(err.message);
});

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
