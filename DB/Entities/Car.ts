import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Wallet } from "./Wallet.js";
import { connection } from "./Connection.js";
import { Transaction } from "./Transaction.js";

@Entity()
export class Car extends BaseEntity {
  @Column({ unique: true })
  id: string;

  @Column()
  email: string;

  @Column()
  owner: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Wallet)
  wallet: Wallet;

  @OneToMany(() => connection, (connection) => connection.car)
  connections: connection[];
}
