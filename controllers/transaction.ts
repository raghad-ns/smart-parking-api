import express from "express";
import bcrypt from "bcrypt";
import { Transaction } from "../DB/Entities/Transaction";
import { Reflect } from "../DB/Entities/Reflect";
import { Car } from "../DB/Entities/Car";
import dataSource from "../DB/dataSource";
const startTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  const transaction = new Transaction();
  const source = await Reflect.findOneBy({ mobileNo: req.body.mobileNo });
  const car = await Car.findOneBy({ car_ID: req.body.carId });
  if (!source || !car) {
    return res.status(401).send("Invalid User or Car");
  } else {
    try {
      transaction.source = source;
      transaction.wallet = car.wallet;
      transaction.amount = req.body.amount;
      transaction.type = "Reflect";
      transaction.status = "In_Progress";
      // generate OTP
      const otp = generateOTP();
      transaction.OTP = otp;
      await transaction.save();
      return {ID: transaction.id, OTP: otp};
    } catch (error) {
      console.log("Error in /api/transaction/charge-wallet : ", error);
      return res.status(500).json({statusCode: 500, message:`Internal Server Error`, data: error});
    }
  }
};

const generateOTP = () => {
  const otpLength = 6;
  const otp = Math.floor(100000 + Math.random() * 900000);
  return String(otp);
};

const chargeWallet = async (req: express.Request, res: express.Response) => {
  const OTP = req.body.OTP;
  const transaction = await Transaction.findOneBy({ id: req.params.id });
  if (!transaction) {
    return res.status(404).json({
      statusCode: 404,
      message: "Not Found",
      data: "The specified resource was not found.",
    });
  }
  // check the otp with user entered otp
  if (await bcrypt.compare(OTP, transaction.OTP)) {
    // mark this as confirmed and save it to database
    transaction.confirmedAt = new Date();

    const querryRunner = dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();
    try {
      transaction.status = "Done";
      
      transaction.source.amount -= transaction.amount;
      transaction.wallet.amount += transaction.amount;
      await transaction.source.save();
      await transaction.wallet.save();
      await transaction.save();
      await querryRunner.commitTransaction();
      return res
        .status(201)
        .json({
          statusCode: 201,
          message: "Created",
          data: "Transaction Confirmed Successfully!",
        });
    } catch (error) {
      await querryRunner.rollbackTransaction();
      return res
        .status(500)
        .json({
          statusCode: 500,
          message: "Internal Server Error",
          data: `Failed To Save The Transaction ${error}`,
        });
    } finally {
      await querryRunner.release();
    }

  } else {
    transaction.status = "Failed";
    transaction.confirmedAt = new Date();
    await transaction.save();
    return res.status(403).json({
      statusCode: 403,
      message: "Forbidden",
      data: "Invalid OTP Provided",
    });
  }
};

export { chargeWallet, startTransaction };
