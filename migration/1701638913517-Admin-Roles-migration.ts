import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../DB/Entities/Role";
import { Permission } from "../DB/Entities/Permission";
import { Car } from "../DB/Entities/Car";
import { Wallet } from "../DB/Entities/Wallet";
import { Reflect } from "../DB/Entities/Reflect";
import jwt from "jsonwebtoken";
import { env } from "process";
import { amount } from "../@types";

export class AdminRolesMigration1701638913517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //Post_car
    const POST_Car = new Permission();
    POST_Car.name = "POST_Car";
    await POST_Car.save();
    //Post_manager
    const POST_Manager = new Permission();
    POST_Manager.name = "POST_Manager";
    await POST_Manager.save();
    //post connection
    const POST_Connection = new Permission();
    POST_Connection.name = "POST_Connection";
    await POST_Connection.save();
    //get connection
    const GET_Connection = new Permission();
    GET_Connection.name = "GET_Connection";
    await GET_Connection.save();
    //post parking
    const POST_Parking = new Permission();
    POST_Parking.name = "POST_Parking";
    await POST_Parking.save();
    //get parking
    const GET_Parking = new Permission();
    GET_Parking.name = "GET_Parking";
    await GET_Parking.save();
    //get reflect
    const GET_Reflect = new Permission();
    GET_Reflect.name = "GET_Reflect";
    await GET_Reflect.save();
    //post reflect
    const POST_Reflect = new Permission();
    POST_Reflect.name = "POST_Reflect";
    await POST_Reflect.save();
    //post transaction
    const POST_Transaction = new Permission();
    POST_Transaction.name = "POST_Transaction";
    await POST_Transaction.save();
    //get transaction
    const GET_Transaction = new Permission();
    GET_Transaction.name = "GET_Transaction";
    await GET_Transaction.save();
    //get balance
    const GET_Balance = new Permission();
    GET_Balance.name = "GET_Balance";
    await GET_Balance.save();
    //User Role
    const user = new Role();
    user.roleName = "User";
    user.permissions = [
      POST_Connection,
      GET_Connection,
      GET_Parking,
      POST_Transaction,
      GET_Transaction,
      GET_Balance,
    ];
    await user.save();
    //Manager Role
    const manager = new Role();
    manager.roleName = "Manager";
    manager.permissions = [POST_Car, POST_Parking];
    await manager.save();
    //admin Role
    const Admin = new Role();
    Admin.roleName = "Admin";
    Admin.permissions = [
      POST_Car,
      POST_Manager,
      POST_Parking,
      GET_Reflect,
      POST_Reflect,
      GET_Balance,
    ];
    await Admin.save();

    //admin User
    const AdminUser = new Car();
    AdminUser.car_ID = "1";
    AdminUser.email = "201160@ppu.edu.ps";
    AdminUser.password = "mohammad123M@";
    AdminUser.status = "active";
    AdminUser.role = Admin;
    AdminUser.wallet = new Wallet();
    const token: amount = {
      id: AdminUser.wallet.id,
      balance: "0",
    };
    const adminAmount = jwt.sign(token, process.env.MONEY_JWT_KEY || "");
    AdminUser.wallet.amount = adminAmount;
    await AdminUser.wallet.save();
    await AdminUser.save();

    //create admin reflect accont
    const reflect = new Reflect();
    reflect.mobileNo = env.ADMIN_REFLECT_MOBILE_NUMBER || "0569726909";
    reflect.password = "123moh2Ml";
    reflect.owner = "Smart Parking System";
    await reflect.save();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("POST_Car")`);
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("POST_Manager")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("POST_Connection")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("GET_Connection")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("POST_Parking")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("GET_Parking")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("POST_Reflect")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("GET_Reflect")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("POST_Transaction")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("GET_Transaction")`
    );
    await queryRunner.query(
      `DELETE FROM Permission (name) VALUES("GET_Balance")`
    );
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Admin`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "User`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Manager`);
    await queryRunner.query(`DELETE FROM User WHERE car_ID = "1"`);
    await queryRunner.query(
      `DELETE FROM Reflect WHERE mobileNo = "0569726909"`
    );
  }
}
