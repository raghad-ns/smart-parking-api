import { DataSource } from "typeorm";
import { User } from "./Entities/User";
import { connection } from "./Entities/Connection";
import { parking } from "./Entities/Parking";
import { Reflect } from "./Entities/reflect";
import { Transaction } from "./Entities/Transaction";
import { Wallet } from "./Entities/Wallet";

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, connection, parking, Reflect, Transaction, Wallet],
  migrations: ["./**/migration/*.ts"],
  synchronize: true,
  logging: true,
});

export default dataSource;
