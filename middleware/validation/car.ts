import express from "express";
import { Car } from "../../DB/Entities/Car";
import { In } from "typeorm";
import { logger, secureLog } from "../../log";

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
    logger.error(`Failed to validate new car: ${errorList}`);
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid car credentials",
      data: errorList,
    });
  } else {
    next();
  }
};

const validateManager = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["Email", "Name"];
  const car = req.body;

  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to add new car!`);
    }
  });
  //to check if ther are no manager with the same email
  const [test] = await Car.findAndCount({
    relations: { role: true },
    where: { email: car.Email, role: { roleName: In(["Manager", "Admin"]) } },
  });

  if (test.length !== 0) {
    errorList.push("There are a manager with the same email");
  }

  if (errorList.length > 0) {
    logger.error(`Failed to validate new manager: ${errorList}`);
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid manager credentials",
      data: errorList,
    });
  } else {
    next();
  }
};

const validateManagerLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["Email", "Password"];
  const user = req.body;
  let errorList: string[] = [];

  values.forEach((key) => {
    if (!user[key]) {
      errorList.push(`${key} is Required to LogIn!`);
    }
  });

  if (errorList.length) {
    logger.error(`Failed to validate manager login: ${errorList}`);
    res.status(401).json({
      statusCode: 401,
      message: "Invalid car credentials",
      data: errorList,
    });
  } else {
    const x = await Car.findOneBy({ email: user.Email });
    if (x === null) {
      secureLog("info", `Manager with Email "${user.Email}" does not exist.`);
      res.status(404).json({
        statusCode: 404,
        message: "Inter valid credentials",
        data: {},
      });
    } else if (x.status == "inactive") {
      secureLog(
        "info",
        `Manager account for Email "${user.Email}" is inactive and trying to login`
      );
      res.status(400).json({
        statusCode: 400,
        message: "Set your password first",
        data: {},
      });
    } else {
      next();
    }
  }
};

const validateUserLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["Car_ID", "Password"];
  const user = req.body;
  let errorList: string[] = [];

  values.forEach((key) => {
    if (!user[key]) {
      errorList.push(`${key} is Required to LogIn!`);
    }
  });

  if (errorList.length) {
    logger.error(`Missing parameters for user login: ${errorList.join(", ")}`);
    res.status(401).json({
      statusCode: 401,
      message: "Invalid user login credentials",
      data: errorList,
    });
  } else {
    const x = await Car.findOneBy({ car_ID: user.Car_ID });
    if (x === null) {
      logger.error(`Failed to find the car with ID "${user.Car_ID}" in login`);
      res.status(404).json({
        statusCode: 404,
        message: "Invalid car credentials",
        data: {},
      });
    } else if (x.status == "inactive") {
      secureLog(
        "info",
        `user account for car id "${user.Car_ID}" is inactive and trying to login`
      );
      res.status(400).json({
        statusCode: 400,
        message: "Set your password first",
        data: {},
      });
    } else if (x.car_ID != user.Car_ID) {
      //ensure it's case sensitive
      logger.error(
        `Login request used incorrect casing for car_id ("${user.Car_ID}") vs stored value ("${x.car_ID}")`
      );
      res.status(404).json({
        statusCode: 404,
        message: "Invalid car credentials",
        data: {},
      });
    } else {
      next();
    }
  }
};

export {
  validateNewCar,
  validateManagerLogin,
  validateManager,
  validateUserLogin,
};
