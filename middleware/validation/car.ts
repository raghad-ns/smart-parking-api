import express from "express";
import { Car } from "../../DB/Entities/Car.js";

const validateNewCar = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["Owner", "Car_Id", "Email"];
  const car = req.body;
  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to add new car!`);
    }
  });

  const checkCar = await Car.findOneBy({ car_ID: car.Car_Id });

  if (checkCar !== null) {
    errorList.push("This car already exist");
  }

  if (errorList.length) {
    return res.status(401).json({ errors: errorList });
  } else {
    next();
  }
};

const passwordMatched = (pass: string, confirm: string) => {
  if (pass.length === confirm.length) {
    // for (let i = 0; i < pass.length; i++) {
    //   if (pass[i] === confirm[i]) {
    //     continue;
    //   } else {
    //     return false;
    //   }
    // }
    return true;
  } else {
    return false;
  }
};

export { validateNewCar, passwordMatched };
