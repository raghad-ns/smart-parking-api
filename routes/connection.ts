import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import jwt from "jsonwebtoken";
import {
  validateEndConnection,
  validateNewConnection,
} from "../middleware/validation/connection";
import {
  endConnection,
  getHistory,
  startConnection,
} from "../controllers/connection";
import { logger, secureLog } from "../log";
const router = express.Router();
router.post(
  "/park",
  authenticate,
  authorize("POST_Connection"),
  validateNewConnection,
  async (req, res) => {
    startConnection(req, res);
  }
);

router.post(
  "/leave",
  authenticate,
  authorize("POST_Connection"),
  validateEndConnection,
  async (req, res) => {
    endConnection(req, res);
  }
);

router.get("/history", authenticate, authorize("GET_Connection"), async (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "6",
  };
  const token = jwt.decode(req.headers["authorization"] || "", {
    json: true,
  });

  getHistory(req, res, payload, token?.userId)
    .then((data) => {
      secureLog("info", `car parking history retrived: ${data}`);
      res.status(200).json({
        statusCode: 200,
        message: "parking hestory retrived",
        data: { data },
      });
    })
    .catch((err) => {
      logger.error(
        `Internal Server Error while getting  car parking history: ${err}`
      );
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        data: { err },
      });
    });
});

export default router;
