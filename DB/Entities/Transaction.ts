import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
  BeforeInsert,
} from "typeorm";
import bcrypt from 'bcrypt';
import { Wallet } from "./Wallet";
import { Reflect } from "./Reflect";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "Reflect" })
  type: string;

  @Column('float')
  amount: number;

  @BeforeInsert()
  async hashPassword() {
    if (this.OTP) {
      this.OTP = await bcrypt.hash(this.OTP, 10);
    }
  }
  @Column("text")
  OTP: string;

  @Column({
    type: "enum",
    enum: ["Done", "Failed", "In_Progress"],
    default: "In_Progress",
  })
  status: "Done" | "Failed" | "In_Progress";

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {eager: true})
  wallet: Relation<Wallet>;

  @ManyToOne(() => Reflect, (reflect) => reflect.transactions, {eager: true})
  source: Relation<Reflect>;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column('timestamp', {default: ()=> "CURRENT_TIMESTAMP"})
  confirmedAt: Date;
}
