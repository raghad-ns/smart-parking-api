import express from "express";
import { Reflect } from "../../DB/Entities/Reflect";
import {
  checkPasswordStrength,
  passwordMatched,
} from "../../controllers/password";
const validateReflect = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["owner", "mobileNo", "password", "cofirm_password", "amount"];
  const car = req.body;
  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to add new car!`);
    }
  });

  const checkCar = await Reflect.findOneBy({ mobileNo: car.mobileNo });

  if (checkCar !== null) {
    errorList.push("Invalid mobile number");
  }

  try {
    const amount = parseFloat(car.amount);
    if (amount < 0) {
      errorList.push(`you should add possitive amount`);
    }
  } catch (err) {
    errorList.push("invalid amount format");
  }

  const password = car.password.toString();
  const confirm = car.cofirm_password.toString();
  const status = passwordMatched(password, confirm);
  if (status !== true) {
    errorList.push(status);
  }

  if (errorList.length) {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid Reflect credentials",
      data: errorList,
    });
  } else {
    next();
  }
};

export { validateReflect };
