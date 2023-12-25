import "./Login.scss";
import React, { useState } from 'react';
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //ngăn chặn hành vi mặc định của sự kiện submit của biểu mẫu, ngăn trình duyệt tải lại trang web.
    try {
      await newRequest.post("auth/login", { username, password }).then(res => {
        if (res.status == 200) {
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          return navigate("/") //login xong sẽ điều hướng sang trang chủ
          //localStorage.setItem("currentUser", JSON.stringify(res.data)); lưu trữ dữ liệu từ res.data dưới dạng chuỗi JSON dưới khóa "currentUser" trong localStorage. Điều này cho phép bạn lưu trữ thông tin về người dùng hoặc bất kỳ dữ liệu nào mà bạn muốn giữ lại trong trình duyệt và có thể truy cập sau này.
        } else {
          setError(res.data);
        }
      }) //lấy url tại file ultils/newRequest
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>
        <label htmlFor="">Tên người dùng</label>
        <input name="Tên người dùng" type="text" placeholder="tunnguyen21" onChange={e => setUsername(e.target.value)} />

        <label htmlFor="">Mật khẩu</label>
        <input
          name="mật khẩu"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="Submit">Đăng nhập</button>
        <a href="http://localhost:3000">Đi đến trang quản trị</a>
        <p style={{ color: 'red' }}>{error}</p>
      </form>
    </div>
  );
}


export default Login