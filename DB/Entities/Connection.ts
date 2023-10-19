import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
  Timestamp,
} from "typeorm";
import { User } from "./User.js";
import { parking } from "./Parking.js";
import { Wallet } from "./Wallet.js";

@Entity()
export class connection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time = Timestamp;

  @Column()
  end_time = Timestamp;

  @Column()
  cost: number;

  @ManyToOne(() => User, (user) => user.connections)
  car: Relation<User>;

  @ManyToOne(() => parking, (parking) => parking.connections)
  parking: Relation<parking>;

  @ManyToOne(() => Wallet, (wallet) => wallet.connections)
  wallet: Relation<Wallet>;
}
