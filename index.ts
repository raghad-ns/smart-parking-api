import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import braintree from "braintree";
// import helmet from 'helmet';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dataSource from "./DB/dataSource";
import home from "./routes/car";
import fs from "fs";
import https from "https";
import parking from "./routes/parking";
import reflect from "./routes/reflect";
import transaction from "./routes/transaction";
import wallet from "./routes/wallet";
import connection from "./routes/connection";
import { secureDecrypt, secureLog } from "./log";
import { error } from "console";
//For env File
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "fbnw5nd4ckjswmq4",
  publicKey: "8c4hhzczznwpcvnn",
  privateKey: "af96ac02716ba048673b74222e8e0a9d",
});

const server = https.createServer(options, app);
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/home", home);
app.use("/parking", parking);
app.use("/Reflect", reflect);
app.use("/charge", transaction);
app.use("/transactions", wallet);
app.use("/simulation", connection);

app.get("/", (req, res) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.get("/api/braintree/token", (req, res) => {
  // gateway.clientToken.generate({}, (err, response) => {
  //   if (err) throw err;
  //   res.send({ clientToken: response.clientToken });
  // });
  gateway.clientToken
    .generate({})
    .then((response) => {
      res.send({ clientToken: response.clientToken });
    })
    .catch((error) => {
      res.status(500).end();
    });
});

app.post("/api/braintree/checkout", (req, res) => {
  const { nonce } = req.body;

  // Use the nonce to make a transaction on the server side
  gateway.transaction
    .sale({
      amount: "10.00",
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

server.listen(port, () => {
  console.log(`App is lestining to PORT.. : ${port} using https`);
  secureLog("info", "App is lestining to PORT: 5000");
  dataSource
    .initialize()
    .then(() => {
      console.log("connected to database :)");
    })
    .catch((err) => {
      console.log("failed to connect to db !! " + err);
    });
});
