import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', {nullable: true})
  owner: string;

  @Column('int', {nullable: true})
  amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Relation<Transaction[]>;
}
