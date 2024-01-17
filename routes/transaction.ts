import express from "express";
import { validateTransaction, confirmTransaction } from "../middleware/validation/transaction";
import { startTransaction, chargeWallet } from "../controllers/transaction";

const router = express.Router();

router.post("", validateTransaction, async (req, res) => {
  startTransaction(req, res)
    .then((data) =>
      res
        .status(201)
        .json({ statusCode: 201, message: "transaction in progress", data: data })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ statusCode: 500, message: "Transaction failed", data: err })
    );
});

router.post("/confirm/:id", confirmTransaction, async (req, res) => {
  chargeWallet(req,res);
});

export default router;
