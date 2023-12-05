import express from "express";
import { Car } from "../../DB/Entities/Car";
import { checkPasswordStrength } from "../../controllers/password";
import { error } from "console";

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
    return res.status(401).json({ statusCode: 401, message: "Invalid car credentials", data: errorList });
  } else {
    next();
  }
};

const validateNewCarByAdmin = async (
  req: express.Request,
  res: express.Response
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
    return res.status(401).json({ statusCode: 401, message: "Invalid car credentials", data: errorList });
  } else {
    return true;
  }
};

const validateNewManagerByAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  const values = ["Email", "Role"];
  const car = req.body;

  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to add new car!`);
    }
  });

  const checkCar = await Car.findOneBy({ email: car.Email });

  if (checkCar !== null) {
    // if (checkCar.role?.roleName === "Manager") {
      errorList.push("Ther's a Manager with the same email");
    // } else errorList.push("Change the Manger email");
  }

  if (car.Role !== "Manager") errorList.push("Invalid Role");

  if (errorList.length) {
    return res.status(401).json({ statusCode: 401, message: "Invalid manager credentials", data: errorList });
  } else {
    return true;
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
    res.status(401).json({ statusCode: 401, message: "Invalid car credentials", data: errorList });
  } else {
    const x = await Car.findOneBy({ email: user.email });
    if (x === null) {
      res.status(404).json({ statusCode: 404, message: "Inter valid credentials", data: {} });
    }else if(x.status == "inactive"){
      res.status(400).json({ statusCode: 400, message: "Set your password first", data: {} });
    } 
    else {
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
    res.status(401).json({ statusCode: 401, message: "Invalid user login credentials", data: errorList });
  } else {
    const x = await Car.findOneBy({ car_ID: user.car_ID });
    if (x === null) {
      res.status(404).json({ statusCode: 404, message: "Invalid car credentials", data: {} });
    }else if(x.status == "inactive"){
      res.status(400).json({ statusCode: 400, message: "Set your password first", data: {} });
    }  
    else {
      next();
    }
  }
};

export {
  validateNewCar,
  validateNewCarByAdmin,
  validateManagerLogin,
  validateNewManagerByAdmin,
  validateUserLogin,
};
