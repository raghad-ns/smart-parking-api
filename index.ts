import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import dataSource from "./DB/dataSource";
import home from "./routes/car";
//For env File
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/home", home);

app.get("/", (req, res) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
  dataSource
    .initialize()
    .then(() => {
      console.log("DB is connected");
    })
    .catch((err) => {
      console.log(err);
    });
});
