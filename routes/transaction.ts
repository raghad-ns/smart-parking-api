import express from "express";
import {
  validateTransaction,
  confirmTransaction,
} from "../middleware/validation/transaction";
import { startTransaction, chargeWallet } from "../controllers/transaction";
import { logger, secureLog } from "../log";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";

const router = express.Router();

router.post(
  "",
  authenticate,
  authorize("POST_Transaction"),
  validateTransaction,
  async (req, res) => {
    startTransaction(req, res)
      .then((data) => {
        secureLog("info", `Transaction  started: ${JSON.stringify(data)}`);
        res.status(201).json({
          statusCode: 201,
          message: "transaction in progress",
          data: data,
        });
      })
      .catch((err) => {
        logger.error(`Error starting transaction: ${JSON.stringify(err)}`);
        res
          .status(500)
          .json({ statusCode: 500, message: "Transaction failed", data: err });
      });
  }
);

router.post(
  "/confirm/:id",
  authenticate,
  authorize("POST_Transaction"),
  confirmTransaction,
  async (req, res) => {
    chargeWallet(req, res);
  }
);

export default router;
