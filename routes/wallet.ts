import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { getWalletTransactions, getWalletBalance } from "../controllers/wallet";
import { authorize } from "../middleware/auth/authorization";
const router = express.Router();
router.get("", authenticate, authorize("GET_Transaction"), async (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getWalletTransactions(req, res, payload);
});

router.get(
  "/balance",
  authenticate,
  authorize("GET_Balance"),
  async (req, res) => {
    getWalletBalance(req, res)
      .then((data) => {
        res.status(200).json({ statusCode: 200, message: "OK", data: data });
      })
      .catch((err) => {
        res.status(500).json({
          statusCode: 500,
          message: "Error while getting the user's wallet Balance.",
          data: err,
        });
      });
  }
);
export default router;
