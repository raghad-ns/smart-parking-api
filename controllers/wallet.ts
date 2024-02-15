import express from "express";
import { GetAll, Transactions } from "../@types";
import jwt from "jsonwebtoken";
import { Car } from "../DB/Entities/Car";
import { Transaction } from "../DB/Entities/Transaction";
import { logger } from "../log";
const getWalletTransactions = async (
  req: express.Request,
  res: express.Response,
  payload: GetAll
) => {
  const token = req.headers["authorization"] || "";
  const decoded = jwt.decode(token, { json: true });
  const car = await Car.findOneBy({ id: decoded?.userId });
  const page = parseInt(payload.page);
  const pageSize = parseInt(payload.pageSize);
  //git transactions
  const [transactions, total] = await Transaction.findAndCount({
    skip: pageSize * (page - 1),
    take: pageSize,
    relations: { wallet: true },
    where: {
      status: "Done",
      wallet: { id: car?.wallet.id },
    },
    order: { confirmedAt: "DESC" },
  });
  //changing the form of wallet transactions
  let test: Transactions[] = [];
  transactions.forEach((i) => {
    let data: Transactions = {
      balance: 0,
      confirmed: new Date(),
      from: "",
      type: "",
    };
    data.balance = i.amount;
    data.confirmed = i.confirmedAt;
    data.from = i.source.mobileNo;
    data.type = i.type;
    test.push(data);
  });
  return test;
};

const getWalletBalance = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.headers["authorization"] || "";
    const decoded = jwt.decode(token, { json: true });
    const car = await Car.findOneBy({
      id: decoded?.userId,
    });
    const wallet = car?.wallet;

    if (!car) throw "Car not found";
    else if (!wallet) throw "Wallet not connected to this car";
    const verify = jwt.verify(wallet?.amount, process.env.MONEY_JWT_KEY || "");
    if (!verify) {
      logger.error(
        `the amount token with id: ${wallet.id} failed to pass verificaion: ${wallet.amount}`
      );
    }
    const balance = parseFloat(
      jwt.decode(wallet?.amount, { json: true })?.balance
    );
    return balance;
  } catch (err) {
    throw err;
  }
};
export { getWalletTransactions, getWalletBalance };
