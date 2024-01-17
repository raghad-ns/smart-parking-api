import express from "express";
import { Car } from "../../DB/Entities/Car";
import bcrypt from "bcrypt";
import { Reflect } from "../../DB/Entities/Reflect";
import { Transaction } from "../../DB/Entities/Transaction";
import { FindOperator } from "typeorm";
const validateTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["carId", "mobileNo", "password", "amount"];
  const car = req.body;
  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to transfer money!`);
    }
  });
  // check the mobile number format
  if (!/^(\+\d{1,3}|0)?\d{9}$/.test(String(req.body.mobileNo).trim())) {
    errorList.push("Mobile Number should be valid!");
  }
  //checking password length
  if (car.password && car.password.length < 8) {
    errorList.push("Password must be at least 8 characters long");
  }
  if (errorList.length > 0) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Bad Request", data: errorList });
  }
  const testCar = await Car.findOneBy({ car_ID: car.carId });
  if (!testCar) {
    errorList.push("Invalid Car ID");
  }

  const reflect = await Reflect.findOneBy({ mobileNo: car.mobileNo });
  if (!reflect) {
    errorList.push("User does not exist");
  } else {
    // compare the password with user's password
    const status = await bcrypt.compare(car.password || "", reflect.password);
    if (!status) {
      errorList.push("Invalid Reflect account");
    } else {
      const amount = Number(car.amount);

      if (Number(reflect.amount) < amount) {
        errorList.push("You don't have enough balance");
      }
    }
    //check if that reflect account has In_Progress transaction
    //can't start a new transaction if the reflect user has an In_Progress transaction
    const test = await Transaction.find({
      relations: { source: true },
      where: {
        status: "In_Progress",
        source: {
          mobileNo: reflect?.mobileNo,
          id: reflect.id
        },
      },
    });
console.log(test);

    if(test.length > 0)
    {
      return res
      .status(400)
      .json({ statusCode: 400, message: "unclosed transaction", data: "there is In_Progress transaction needs to be handeled" })
      .send();
    }
  }

  // const x = reflect?.transactions;
  // const test = x?.filter((st) => st.status === "In_Progress");
  // if (test?.length !== 0) {
  //   errorList.push("You need to deal with unconfirmed transactions");
  // }


  if (errorList.length > 0) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Bad Request", data: errorList })
      .send();
  } else {
    return next();
  }
};

const confirmTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.params.id) {
    return res.status(400).json({
      statusCode: 400,
      message: "Bad Request",
      data: "invalid transaction",
    });
  }
  const transaction = await Transaction.findOneBy({ id: req.params.id });

  if (transaction === null) {
    return res.status(404).json({
      statusCode: 404,
      message: "Invalid transaction",
      data: `Failed To confirm The Transaction`,
    });
  }
  if (transaction.status === "Done" || transaction.status === "Failed") {
    return res.status(400).json({
      statusCode: 400,
      message: "Bad Request",
      data: "You've already confirmed/canceled the transaction",
    });
  }
  if (!req.body.OTP) {
    return res.status(400).json({
      statusCode: 400,
      message: "Bad Request",
      data: "OTP is required",
    });
  }
  next();
};

export { validateTransaction, confirmTransaction };
