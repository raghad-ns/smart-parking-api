import { Column } from "typeorm/browser";
import { OneToMany } from "typeorm/browser";
import { PrimaryGeneratedColumn } from "typeorm/browser";
import { BaseEntity } from "typeorm/browser";
import { Entity } from "typeorm/browser";
import { Transaction } from "./Transaction.js";

@Entity()
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  owner: string;

  @Column({ default: 0 })
  amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Transaction[];
}
