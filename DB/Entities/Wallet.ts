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
import { User } from "./User.js";
import { connection } from "./Connection.js";
import { Transaction } from "./Transaction.js";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ default: 0 })
  amount: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => connection, (connection) => connection.wallet)
  connections: Relation<connection[]>;

  @OneToMany(() => Transaction, (Transaction) => Transaction.wallet)
  transactions: Relation<Transaction[]>;
}
