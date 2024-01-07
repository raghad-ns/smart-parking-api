import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Transaction } from "./Transaction";
import bcrypt from 'bcrypt'

@Entity()
export class Reflect extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', {nullable: true})
  owner: string;

  @Column('int', {nullable: true})
  amount: number;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column('text')
  password: string;

  @Column('text')
  mobileNo: string;

  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Relation<Transaction[]>;
}
