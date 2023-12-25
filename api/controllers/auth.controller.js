import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";


export const register = async (req, res, next) => { //dưới đây là các funtion
    try {
        const hash = bcrypt.hashSync(req.body.password, 5); //chỗ này là để ko hiện mk tài khoản trong mongodb
        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save(); //lưu thông tin
        return res.status(201).send("Tài khoản tạo thành công."); //dki thành công
    } catch (err) {
        next(err) //nếu thông tin sai hoặc trùng với thông tin tài khoản khác thì nó sẽ gửi
    }
};
export const login = async (req, res, next) => {
    try { //Để không hiển thị trường mật khẩu (password) trong phản hồi khi sử dụng Postman hoặc bất kỳ công cụ gửi yêu cầu HTTP nào khác
        const user = await User.findOne({ username: req.body.username }); //findone là tìm đúng 1 cái duy nhất

        if (!user) return next(createError(404, "Không tìm thấy người dùng!")); //nếu tk ko tồn tại thì nó sẽ hiện trạng thái 404 ko tìm thấy ng dùng(được viết trong file createError)

        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect)
            return next(createError(404, "Sai mật khẩu hoặc tên người dùng!"));
        const token = jwt.sign({
            id: user._id,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin //dòng này để cho phép ng dùng bình thường dc thêm order hoặc review chứ ng bán ko dc thêm
        }, process.env.JWT_KEY
        );
        const { password, ...info } = user._doc; //_doc là cách để lấy toàn bộ thông tin về người dùng, và sau đó bạn tạo một bản sao của nó (biến info) mà không bao gồm trường password. Điều này giúp bạn gửi thông tin người dùng cho họ mà không tiết lộ mật khẩu.
        return res
            .cookie("accessToken", token, {
                HttpOnly: true,
            })
            .status(200)
            // .send(info)
            .json({ accessToken: token })

    } catch (err) {
        next(err);
    }
};
export const logout = async (req, res) => {
    return res.clearCookie("accessToken", { //để xóa cookie "accessToken" khỏi trình duyệt của người dùng, đánh dấu họ đã đăng xuất
        sameSite: "none", //để cho site url 8800 cùng với site 5730 của mình
        secure: true,
    })
        .status(200)
        .send("Người dùng đã đăng xuất!");
};