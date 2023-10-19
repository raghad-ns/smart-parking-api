import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
} from "typeorm";
import { Wallet } from "./Wallet.js";
import { Reflect } from "./reflect.js";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "Reflect" })
  type: string;

  @Column()
  amount: number;

  @Column({
    type: "enum",
    enum: ["Done", "Failed", "In Progress"],
    default: "available",
  })
  status: "Done" | "Failed" | "In Progress";

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Relation<Wallet>;

  @ManyToOne(() => Reflect, (reflect) => reflect.transactions)
  source: Relation<Reflect>;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
