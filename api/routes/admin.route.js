import express from "express";
import { adminRole } from "../middleware/adminAuth.js";
import { deleteUser, getAllUsers, CreateUser, getUser, updateUser, getAllProducts, adminLogin, createGig, delProduct, getProduct, updateProduct, getOrders, updateOrders, getAllSellers } from "../controllers/admin.controller.js";
const router = express.Router(); //định nghĩa một tuyến đường trong ứng dụng Express để xóa người dùng. Trước khi xóa, nó kiểm tra tính hợp lệ của token JWT bằng cách sử dụng middleware verifyToken. Nếu token hợp lệ, nó gọi hàm xử lý deleteUser để xóa người dùng.

router.get("/all-users", adminRole, getAllUsers);
router.get("/get-user/:_id", adminRole, getUser);
router.get("/all-products", adminRole, getAllProducts);
router.get('/product/:_id', adminRole, getProduct);
router.get('/orders', adminRole, getOrders);
router.get('/all-sellers', adminRole, getAllSellers);


router.delete("/delete-account/:_id", adminRole, deleteUser);
router.delete('/delete-product/:_id', adminRole, delProduct);
router.post("/create-user", adminRole, CreateUser);
router.post("/login", adminLogin);
router.post('/update-user/:_id', adminRole, updateUser);
router.post('/create-gig', adminRole, createGig);
router.post('/update-gig/:_id', adminRole, updateProduct);
router.post('/update-order/:_id', adminRole, updateOrders);
export default router;
