import express from "express";
import { deleteUser, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { adminRole } from "../middleware/adminAuth.js";
const router = express.Router(); //định nghĩa một tuyến đường trong ứng dụng Express để xóa người dùng. Trước khi xóa, nó kiểm tra tính hợp lệ của token JWT bằng cách sử dụng middleware verifyToken. Nếu token hợp lệ, nó gọi hàm xử lý deleteUser để xóa người dùng.

router.delete("/delete-account/:_id", adminRole, deleteUser);
router.get("/:id", getUser);
export default router;
