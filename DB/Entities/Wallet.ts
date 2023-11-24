import {
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  Entity,
  JoinColumn,
  Column,
  Relation,
} from "typeorm";
import { Car } from "./Car.js";
import { Connection } from "./Connection.js";
import { Transaction } from "./Transaction.js";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ default: 0 })
  amount: number;

  @OneToOne(() => Car)
  car: Relation<Car>;

  @OneToMany(() => Connection, (connection) => connection.wallet)
  connections: Relation<Connection[]>;

  @OneToMany(() => Transaction, (Transaction) => Transaction.wallet)
  transactions: Relation<Transaction[]>;
}
