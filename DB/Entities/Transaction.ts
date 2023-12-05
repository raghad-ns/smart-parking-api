import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
} from "typeorm";
import { Wallet } from "./Wallet";
import { Reflect } from "./Reflect";

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
    enum: ["Done", "Failed", "In_Progress"],
    default: "In_Progress",
  })
  status: "Done" | "Failed" | "In_Progress";

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Relation<Wallet>;

  @ManyToOne(() => Reflect, (reflect) => reflect.transactions)
  source: Relation<Reflect>;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
