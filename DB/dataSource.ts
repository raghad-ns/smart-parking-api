import { DataSource } from "typeorm";
import { Car } from "./Entities/Car";
import { Connection } from "./Entities/Connection";
import { Parking } from "./Entities/Parking";
import { Reflect } from "./Entities/Reflect.1";
import { Transaction } from "./Entities/Transaction";
import { Wallet } from "./Entities/Wallet";
import { Permission } from "./Entities/Permission";
import { Role } from "./Entities/Role";
import dotenv from "dotenv";
dotenv.config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Car,
    Connection,
    Parking,
    Reflect,
    Transaction,
    Wallet,
    Permission,
    Role,
  ],
  synchronize: true,
  logging: false,
});

export default dataSource;
