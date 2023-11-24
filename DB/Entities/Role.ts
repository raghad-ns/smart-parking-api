import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  Relation,
} from "typeorm";
import { Permission } from "./Permission.js";
import { Car } from "./Car.js";
@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  roleName: string;

  @OneToMany(() => Car, (car) => car.role)
  cars: Relation<Car[]>;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable()
  permissions: Relation<Permission[]>;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP()",
  })
  createdAt: Date;
}
