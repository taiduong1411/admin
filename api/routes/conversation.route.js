import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { userRole } from '../middleware/userAuth.js';
const router = express.Router();

router.get("/", userRole, getConversations);
router.post("/", userRole, createConversation);
router.get("/single/:id", getSingleConversation);
router.put("/:id", updateConversation);


export default router;
