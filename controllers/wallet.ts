import express from "express";
import { GetAll, Transactions } from "../@types";
import jwt from "jsonwebtoken";
import { Car } from "../DB/Entities/Car";
import { Transaction } from "../DB/Entities/Transaction";
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
  for (let i = 0; i < total; i++) {
    let data: Transactions = {
      balance: 0,
      confirmed: new Date(),
      from: "",
      type: "",
    };
    data.balance = transactions[i].amount;
    data.confirmed = transactions[i].confirmedAt;
    data.from = transactions[i].source.mobileNo;
    data.type = transactions[i].type;
    test.push(data);
  }
  res.status(200).json({ statusCode: 200, message: "OK", data: test });
};
export default getWalletTransactions;
