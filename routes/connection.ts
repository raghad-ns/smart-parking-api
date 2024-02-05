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
  getHestory,
  startConnection,
} from "../controllers/connection";
const router = express.Router();
router.post(
  "/park",
  authenticate,
  // authorize("Park"),
  validateNewConnection,
  async (req, res) => {
    startConnection(req, res);
  }
);
router.post(
  "/leave",
  authenticate,
  // authorize("Park"),
  validateEndConnection,
  async (req, res) => {
    endConnection(req, res);
  }
);

router.get(
  "/hestory",
  authenticate,
  // authorize("Park"),
  async (req, res) => {
    const payload = {
      page: req.query.page?.toString() || "1",
      pageSize: req.query.pageSize?.toString() || "6",
    };
    const token = jwt.decode(req.headers["authorization"] || "", {
      json: true,
    });

    getHestory(req, res, payload, token?.userId)
      .then((data) => {
        res.status(200).json({
          statusCode: 200,
          message: "parking hestory retrived",
          data: { data },
        });
      })
      .catch((err) => {
        res.status(500).json({
          statusCode: 500,
          message: "Internal server error",
          data: { err },
        });
      });
  }
);

export default router;