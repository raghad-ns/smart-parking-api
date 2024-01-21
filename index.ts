import 'reflect-metadata'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dataSource from './DB/dataSource';
import home from './routes/car';
import fs from 'fs'
import https from 'https';
import parking from './routes/parking';
import reflect from './routes/reflect';
import transaction from './routes/transaction';
import wallet from './routes/wallet'
//For env File 
dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

const server = https.createServer(options, app);

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/home", home);
app.use('/parking', parking);
app.use("/Reflect", reflect);
app.use("/charge", transaction);
app.use('/transactions', wallet);

app.get('/', (req, res) => {
  res.send('Welcome to Express & TypeScript Server');
});

server.listen(port, ()=>{
  console.log(`App is lestining to PORT.. : ${port} using https`);

  dataSource
    .initialize()
    .then(() => {
      console.log("connected to database :)");
    })
    .catch((err) => {
      console.log("failed to connect to db !! " + err);
    });
  
});