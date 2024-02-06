import express from "express";
import { Car } from "../../DB/Entities/Car";
import { In } from "typeorm";

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
    res.status(401).json({
      statusCode: 401,
      message: "Invalid car credentials",
      data: errorList,
    });
  } else {
    const x = await Car.findOneBy({ email: user.Email });
    if (x === null) {
      res.status(404).json({
        statusCode: 404,
        message: "Inter valid credentials",
        data: {},
      });
    } else if (x.status == "inactive") {
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
    res.status(401).json({
      statusCode: 401,
      message: "Invalid user login credentials",
      data: errorList,
    });
  } else {
    const x = await Car.findOneBy({ car_ID: user.Car_ID });
    if (x === null) {
      res.status(404).json({
        statusCode: 404,
        message: "Invalid car credentials",
        data: {},
      });
    } else if (x.status == "inactive") {
      res.status(400).json({
        statusCode: 400,
        message: "Set your password first",
        data: {},
      });
    } else if (x.car_ID != user.Car_ID) {
      //ensure it's case sensitive
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
