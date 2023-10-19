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
import { connection } from "./Connection.js";
import { Transaction } from "./Transaction.js";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("rowid")
  id: number;

  @Column()
  amount: number;

  @OneToOne(() => Car)
  @JoinColumn()
  car: Car;

  @OneToMany(() => connection, (connection) => connection.wallet)
  connections: Relation<connection[]>;

  @OneToMany(() => Transaction, (Transaction) => Transaction.wallet)
  transactions: Relation<Transaction[]>;
}
