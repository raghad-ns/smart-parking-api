import { OneToMany, PrimaryGeneratedColumn, BaseEntity, Entity, Relation } from "typeorm";
import { Transaction } from "./Transaction.js";

@Entity('reflect')
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column()
  // owner: string;

  // @Column({ nullable: true })
  // amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Relation<Transaction[]>;
}
