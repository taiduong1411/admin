import axios from "axios";

const newRequest = axios.create({ //tạo một instance mới của Axios ,Instance này được gán vào biến newRequest để bạn có thể sử dụng nó ở những nơi khác trong mã của bạn
    baseURL: "http://localhost:8800/api/", //tức là cta ko cần phải ghi hẳn cả đoạn local... này ra mà chỉ cần newRequest là nó ra
});

export default newRequest;