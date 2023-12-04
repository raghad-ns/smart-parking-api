import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
  Relation,
  PrimaryGeneratedColumn,
  JoinColumn
} from "typeorm";
import bcrypt from "bcrypt";
import { Wallet } from "./Wallet";
import { Connection } from "./Connection";
import { Role } from "./Role";


@Entity()
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  car_ID: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  owner: string;

  @Column({ type: "enum", enum: ["inactive", "active"], default: "inactive" })
  status: "inactive" | "active";

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Relation<Wallet>;

  @OneToMany(() => Connection, (connection) => connection.car)
  connections: Relation<Connection[]>;

  @ManyToOne(() => Role, (role) => role.cars)
  role: Relation<Role>;
}
