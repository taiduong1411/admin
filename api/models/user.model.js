import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true, //chỗ này là để đặt tên username ko bị trùng lặp
        unique: true,
    },
    email: {
        type: String,
        required: true, //chỗ này là để đặt tên email ko bị trùng lặp
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: true,
    },
    phone: { //phone này chỉ dùng cho người bán
        type: String,
        required: false,
    },
    desc: {
        type: String,
        required: false,
    },
    isSeller: {
        type: Boolean,
        default: false, // Đây là trường xác định xem người dùng có phải là người bán hay không, mặc định là false.
    },
    isAdmin: {
        type: Boolean,
        default: false, // Đây là trường xác định xem người dùng có phải là người admin hay không, mặc định là false.
    },
}, {
    timestamps: true //để khi tạo user thì sẽ tạo và update theo tgian
});

export default mongoose.model("User", userSchema)