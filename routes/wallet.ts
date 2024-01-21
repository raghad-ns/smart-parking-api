import express from "express";
import { Transaction } from "../DB/Entities/Transaction";
import { Reflect } from "../DB/Entities/Reflect";
import { Car } from "../DB/Entities/Car";
import { Transactions } from "../@types";
import { authenticate } from "../middleware/auth/authentication";
import getWalletTransactions from "../controllers/wallet";
const router = express.Router();
router.get("", authenticate, async (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getWalletTransactions(req, res, payload);
  ////////////////////////////////
  const car = await Car.findOneBy({ car_ID: req.body.car_ID });
  //find the wallet done transactions
  const [transactions, total] = await Transaction.findAndCount({
    relations: { wallet: true },
    where: {
      status: "Done",
      wallet: { id: car?.wallet.id },
    },
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

  res.status(200).json({ test: test, total });
});
export default router;
