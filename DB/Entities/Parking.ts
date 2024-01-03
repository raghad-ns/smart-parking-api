import {
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  Relation,
} from "typeorm";
import { Connection } from "./Connection";

@Entity()
export class Parking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  location: string;

  @Column({
    type: "enum",
    enum: ["available", "reserved", "disabled"],
    default: "available",
  })
  status: "available" | "reserved" | "disabled";

  @OneToMany(() => Connection, (connection) => connection.parking)
  connections: Relation<Connection[]>;
}
