import express from "express";
import { register, login, logout} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register) //post là để khi đăng kí thì thông tin sẽ dc gửi về
router.post("/login", login)
router.post("/logout", logout)

export default  router;
