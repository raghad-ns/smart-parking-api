import 'reflect-metadata'
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dataSource from './DB/dataSource.js';
import home from './routes/car.js';
//For env File 
dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use("/home", home);

app.get('/', (req, res) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
  dataSource.initialize()
  .then(()=>{
    console.log("DB is connected");
    
  })
  .catch((err)=>{
    console.log(err);
  });
  
});