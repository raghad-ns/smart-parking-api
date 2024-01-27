import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import getWalletTransactions from "../controllers/wallet";
import { authorize } from "../middleware/auth/authorization";
const router = express.Router();
router.get("", authenticate, authorize("GET_Transaction"), async (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getWalletTransactions(req, res, payload);
});
export default router;
