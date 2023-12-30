import User from "../models/user.model.js";
import Gigs from "../models/gig.model.js";
import Orders from "../models/order.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtDecode } from 'jwt-decode';


export const adminLogin = async (req, res, next) => {
    try { //Để không hiển thị trường mật khẩu (password) trong phản hồi khi sử dụng Postman hoặc bất kỳ công cụ gửi yêu cầu HTTP nào khác
        const user = await User.findOne({ username: req.body.username }); //findone là tìm đúng 1 cái duy nhất
        if (!user) return res.status(404).json({ success: false, msg: "Tài khoản hoặc mật khẩu không chính xác" }); //nếu tk ko tồn tại thì nó sẽ hiện trạng thái 404 ko tìm thấy ng dùng
        if (user.isAdmin == false) return res.status(300).json({ success: false, msg: "Bạn Không phải Admin !" });
        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect) return res.status(300).json({ success: false, msg: 'Sai Tài Khoản Hoặc Mật Khẩu' });
        const token = jwt.sign({
            id: user._id,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin //dòng này để cho phép ng dùng bình thường dc thêm order hoặc review chứ ng bán ko dc thêm
        }, process.env.JWT_KEY
        );
        const { password, ...info } = user._doc; //_doc là cách để lấy toàn bộ thông tin về người dùng, và sau đó bạn tạo một bản sao của nó (biến info) mà không bao gồm trường password. Điều này giúp bạn gửi thông tin người dùng cho họ mà không tiết lộ mật khẩu.
        return res.status(200).json({ accessToken: token })
    } catch (err) {
        next(err);
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const _id = req.params._id;
        await User.findByIdAndDelete({ _id: _id }).then(async user => {
            return res.status(200).json({ success: true, msg: 'Xoá Thành Công' });
        }).catch(err => console.log(err))
    } catch (error) {
        return res.status(300).json({ success: true, msg: 'Xoá Thất Bại' });
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        await User.find({ isAdmin: false }).then(users => {
            return res.status(200).json({ success: true, users });
        })
    } catch (error) {
        next(error);
    }
};
export const CreateUser = async (req, res, next) => {
    try {
        const { username, email, password, phone, country, desc, img, isSeller } = req.body;
        const hash = bcrypt.hashSync(password, 5); //chỗ này là để ko hiện mk tài khoản trong mongodb
        await User.findOne({ username: username }).then(async user => {
            if (!user) {
                const data = {
                    username: username,
                    email: email,
                    password: hash,
                    phone: phone,
                    country: country,
                    desc: desc,
                    img: img,
                    isSeller: isSeller
                }
                await User(data).save();
                return res.status(200).json({ success: true, msg: "Thêm Thành Công" })
            } else {
                return res.status(300).json({ success: false, msg: "Tài Khoản Đã Tồn Tại" })
            }
        })
    } catch (error) {
        next(error);
    }
};
export const getUser = async (req, res, next) => {
    try {
        const _id = req.params._id;
        await User.findOne({ _id: _id }).then(user => {
            if (!user) return res.status(404).json({ success: false, msg: "Tài Khoản Không Tồn Tại" })
            return res.status(200).json({ success: true, user });
        })
    } catch (error) {
        next(error);
    }
};
export const updateUser = async (req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 5);
        const data = {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            country: req.body.country,
            desc: req.body.desc,
            password: hash ? hash : "",
            img: req.body.img,
            isSeller: req.body.isSeller
        }
        const _id = req.params._id;
        await User.findOne({ _id: _id }).then(async user => {
            if (!user) return res.status(404).json({ success: false, msg: "Tài Khoản Không Tồn Tại" });
            await User.findByIdAndUpdate(_id, data).then(user => {
                return res.status(200).json({ success: true, msg: `Sửa Tài Khoản ${req.body.username} Thành Công` })
            }).catch(err => {
                return res.status(300).json({ success: false, msg: `Sửa Tài Khoản ${req.body.username} Thất Bại` })
            })
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Có lỗi xảy ra" })
    }
};
export const getAllProducts = async (req, res, next) => {
    try {
        await Gigs.find().lean().sort({ createdAt: -1 }).then(gigs => {
            if (!gigs) return res.status(200).json({ success: true, msg: "Hiện Không Có Sản Phẩm" });
            return res.status(200).json({ success: true, gigs });
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Có Lỗi Xảy Ra Vui Lòng Thử Lại" });
    }
};
export const createGig = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const token_decode = jwtDecode(token);
        console.log(req.body);
        const newGig = {
            userId: req.body.sellerId,
            ...req.body
        }
        const saveGig = await Gigs(newGig).save();
        return res.status(200).json({ saveGig, msg: 'Theem Thanh Cong' });
    } catch (err) {
        console.log(err);
    }
};
export const delProduct = async (req, res, next) => {
    const _id = req.params._id;
    try {
        await Gigs.findByIdAndDelete(_id).then(gig => {
            if (!gig) return res.status(404).json({ success: false, msg: "Sản Phẩm Không Tồn Tại" });
            return res.status(200).json({ success: true, msg: "Xoá Thành Công" });
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Có Lỗi Xảy Ra" });
    }
};
export const getProduct = async (req, res, next) => {
    const _id = req.params._id;
    try {
        await Gigs.findOne({ _id: _id }).then(gig => {
            if (!gig) return res.status(404).json({ success: false, msg: "Không Tìm Thấy Sản Phẩm" })
            return res.status(200).json({ success: true, data: gig });
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "error" });
    }
};
export const updateProduct = async (req, res, next) => {
    const _id = req.params._id;
    const data = {
        title: req.body.title,
        shortTitle: req.body.shortTitle,
        shortDesc: req.body.shortDesc,
        cover: req.body.cover,
        images: req.body.images,
        price: req.body.price,
        deliveryTime: req.body.deliveryTime,
        revisionNumber: req.body.revisionNumber,
        cat: req.body.cat,
        desc: req.body.desc,
        feature: req.body.feature,
        userId: req.body.sellerId
    }
    // console.log(data);
    try {
        await Gigs.findByIdAndUpdate(_id, data).then(gig => {
            return res.status(200).json({ success: true, msg: 'Cập Nhật Thành Công' })
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Có lỗi xảy ra. Vui lòng thử lại' })
    }
};
export const getOrders = async (req, res, next) => {
    try {
        await Orders.find().lean().sort({ createdAt: -1 }).then(orders => {
            if (!orders) return res.status(404).json({ msg: "Không tìm thấy order" })
            orders = orders.map(order => {
                return {
                    _id: order._id,
                    title: order.title,
                    img: order.img,
                    buyerId: order.buyerId,
                    createdAt: order.createdAt.toLocaleDateString('en-GB'),
                    price: order.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
                    isCompleted: order.isCompleted
                }
            })
            return res.status(200).json({ orders })
        })
    } catch (error) {
        return res.status(500).json({ msg: 'server error' })
    }
};
export const updateOrders = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const { isCompleted } = req.body;
        await Orders.findOne({ _id: _id }).then(async order => {
            if (!order) return res.status(404).json({ msg: "Đơn Hàng Không Tồn Tại" })
            if (isCompleted == true) {
                order.isCompleted = true
                await order.save();
                return res.status(200).json({ msg: "Xác Nhận Đơn Hàng Thành Công" })
            } else {
                order.isCompleted = false;
                await order.save();
                return res.status(200).json({ msg: "Huỷ Đơn Hàng Thành Công" })
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error' })
    }
};
export const getAllSellers = async (req, res, next) => {
    try {
        await User.find({ isSeller: true }).then(sellers => {
            if (!sellers) return res.status(404).json({ msg: "Khong co seller dang ton tai" })
            return res.status(200).json({ sellers })
        })
    } catch (error) {
        return res.status(500).json({ msg: "Loi server" })
    }
}