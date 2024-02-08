import express from "express";
import { Reflect } from "../../DB/Entities/Reflect";
import {
  checkPasswordStrength,
  passwordMatched,
} from "../../controllers/password";
import { logger } from "../../log";
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

  const password = String(car.password);
  const confirm = String(car.cofirm_password);
  const status = passwordMatched(password, confirm);
  if (status !== true) {
    errorList.push(status);
  }

  if (errorList.length > 0) {
    logger.error(`Reflect Validation Errors : ${JSON.stringify(errorList)} `);
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
