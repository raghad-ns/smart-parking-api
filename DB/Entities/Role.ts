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
import { User } from "./User.js";
@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  roleName: string;

  @OneToMany(() => User, (car) => car.role)
  cars: Relation<User[]>;

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
