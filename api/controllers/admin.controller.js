import User from "../models/user.model.js";


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
        const { username, email, password, phone, country, desc } = req.body;
        await User.findOne({ username: username }).then(async user => {
            if (!user) {
                const data = {
                    username: username,
                    email: email,
                    password: password,
                    phone: phone,
                    country: country,
                    desc: desc
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
}