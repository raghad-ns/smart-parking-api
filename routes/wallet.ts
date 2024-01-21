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
});
export default router;
