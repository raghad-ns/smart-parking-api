import express from "express";
import { Car } from "../DB/Entities/Car.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { passwordMatched } from "../middleware/validation/car.js";
import { Role } from "../DB/Entities/Role.js";
import { Wallet } from "../DB/Entities/Wallet.js";

const insertCar = async (req: express.Request, res: express.Response) => {
  try {
    const { Owner, Car_Id, Email, Password } = req.body;
    var car = new Car();
    car.owner = Owner;
    car.car_ID = Car_Id;
    car.email = Email;
    car.password = Password;
    // let role = await Role.findOneBy({ roleName: "User" });
    // if (role !== null) {
    //   car.role = role;
    // } else {
    //   res.status(500).send("Error finding the role");
    // }
    let wallet = new Wallet();
    car.wallet = wallet;
    await wallet.save();
    await car.save();
    const payload = {
      email: car.email,
      id: car.id,
    };
    const secret = process.env.PASSWORD_SECRET + car.id;
    const token = jwt.sign(payload, secret, { expiresIn: "5m" });
    const link = `http://localhost:${process.env.PORT}/home/set-password/${car.id}/${token}`;
    console.log(link);
  } catch (error) {
    console.log(error);
    throw `${error}`;
  }
};

const setPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    const car = await Car.findOneBy({ id: id });
    if (car === null) {
      throw "invalid id...";
      return;
    }
    const secret = process.env.PASSWORD_SECRET + car.id;
    const payload = jwt.verify(token, secret);
    const decode = jwt.decode(token, { json: true });
    if (payload) {
      if (decode !== null && decode.id === car.id) {
        if (car.status === "inactive") {
          if (passwordMatched(password, password2) === true) {
            car.password = await bcrypt.hash(password, 10);
            car.status = "active";
            await car.save();
          } else {
            throw "invalid password cridentials";
          }
        } else throw "password already set";
      } else {
        throw "invalid token";
      }
    } else {
      throw "invalid token";
    }
  } catch (error) {
    throw error;
  }
};

export { insertCar, setPassword };
