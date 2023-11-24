import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
  Timestamp,
} from "typeorm";
import { Car } from "./Car.js";
import { Parking } from "./Parking.js";
import { Wallet } from "./Wallet.js";

@Entity()
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  cost: number;

  @ManyToOne(() => Car, (user) => user.connections)
  car: Relation<Car>;

  @ManyToOne(() => Parking, (parking) => parking.connections)
  parking: Relation<Parking>;

  @ManyToOne(() => Wallet, (wallet) => wallet.connections)
  wallet: Relation<Wallet>;
}
