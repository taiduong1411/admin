import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.urlencoded({
    extended: true
}));
dotenv.config();
mongoose.set('strictQuery', true)

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO); //chỗ này là lấy thông tin mongo db trong file .env
        console.log("Connected to mongoDB!") //để kết nối mongodb
    } catch (error) {
        console.log(error);
    }
};

app.use(express.json()); //Nếu bạn gửi một yêu cầu POST với dữ liệu JSON chứa thông tin về người dùng mới, dòng mã này sẽ giúp bạn trích xuất thông tin đó và sử dụng nó để tạo một tài khoản người dùng mới trong ứng dụng của bạn.
app.use(cookieParser());
app.use(cors());//Tùy chọn này chỉ định nguồn (origin) mà ứng dụng cho phép gửi yêu cầu tới
app.use(cors({ origin: '127.0.0.1:5173', credentials: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    next();
});
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin", adminRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Có gì đó không đúng!";

    return res.status(errorStatus).send(errorMessage);
})

app.listen(8800, () => {
    connect()
    console.log('Backend server is running on 8800');
})