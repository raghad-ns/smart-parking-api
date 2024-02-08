import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { getWalletTransactions, getWalletBalance } from "../controllers/wallet";
import { authorize } from "../middleware/auth/authorization";
import { logger, secureLog } from "../log";
const router = express.Router();
router.get("", authenticate, authorize("GET_Transaction"), async (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getWalletTransactions(req, res, payload)
    .then((data) => {
      secureLog("info", `the user reviewd his trnsactions: ${data}`);
      res.status(200).json({ statusCode: 200, message: "OK", data: data });
    })
    .catch((err) => {
      logger.error(
        `Error getting transactions for the wallet of user: ${err})`
      );
      res.status(500).json({
        statusCode: 500,
        message: "Error while getting the user's car transactions.",
        data: err,
      });
    });
});

router.get(
  "/balance",
  authenticate,
  authorize("GET_Balance"),
  async (req, res) => {
    getWalletBalance(req, res)
      .then((data) => {
        secureLog("info", `the car wallet balance retrived: ${data}`);
        res.status(200).json({ statusCode: 200, message: "OK", data: data });
      })
      .catch((err) => {
        logger.error(`error while getting the user's wallet balance: ${err}`);
        res.status(500).json({
          statusCode: 500,
          message: "Error while getting the user's wallet Balance.",
          data: err,
        });
      });
  }
);
export default router;
