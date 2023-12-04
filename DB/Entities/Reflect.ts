import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Transaction } from "./Transaction";

@Entity('reflect')
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column()
  // owner: string;

  // @Column()
  // amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Relation<Transaction[]>;
}
