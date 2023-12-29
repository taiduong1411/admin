import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm } from "../controllers/order.controller.js";
import { userRole } from "../middleware/userAuth.js";
const router = express.Router();

// router.post("/:gigId", verifyToken, intent);
router.get("/", userRole, getOrders);
router.post("/create-payment-intent/:id", intent);
router.put("/", confirm);

export default router;
