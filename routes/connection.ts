import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import jwt from "jsonwebtoken";
import {
  validateEndConnection,
  validateNewConnection,
} from "../middleware/validation/connection";
import { endConnection, startConnection } from "../controllers/connection";
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

export default router;
