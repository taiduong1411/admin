import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {

    const user = await User.findById(req.params.id);


    if (req.userId !== user._id.toString()) {
        return next(createError(403, "Bạn chỉ có thể xóa tài khoản của bạn!"));
    }
    await User.findByIdAndDelete(req.params.id); //Nó sẽ tìm tới id đó và xóa
    res.status(200).send("Đã xóa!")
};
export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
};

