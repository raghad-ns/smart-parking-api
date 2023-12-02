import { Column, OneToMany, PrimaryGeneratedColumn, BaseEntity, Entity } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column()
  // owner: string;

  // @Column({ default: 0 })
  // amount: number;

//   @OneToMany(() => Transaction, (transaction) => transaction.source)
//   transactions: Transaction[];
}
