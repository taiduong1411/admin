import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => { //để xác minh tính hợp lệ của một token JWT (JSON Web Token) từ một cookie có tên "accessToken" trong yêu cầu HTTP
    const token = req.cookie.accessToken;
    console.log(token, 'abcccc');
    if (!token)
        return next(createError(401, "Bạn chưa đăng kí!"));

    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return next(createError(403, "Token không hợp lệ!"));
        req.userId = payload.id;
        req.isSeller = payload.isSeller;
        next() //cho phép quá trình xác minh token và gắn dữ liệu từ payload vào req được thực hiện trước khi điều hướng tiếp tục đến các xử lý sau đó của yêu cầu HTTP.
    });
}