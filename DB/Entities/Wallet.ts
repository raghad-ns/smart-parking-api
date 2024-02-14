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
import { Car } from "./Car";
import { Connection } from "./Connection";
import { Transaction } from "./Transaction";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text',{ default: "" })
  amount: string;

  @OneToOne(() => Car)
  car: Relation<Car>;

  @OneToMany(() => Connection, (connection) => connection.wallet)
  connections: Relation<Connection[]>;

  @OneToMany(() => Transaction, (Transaction) => Transaction.wallet)
  transactions: Relation<Transaction[]>;
}
