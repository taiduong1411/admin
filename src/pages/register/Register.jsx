import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null); //Khi bạn cập nhật hoặc thay đổi giá trị của file hoặc user, React sẽ tự động cập nhật giao diện người dùng để hiển thị giá trị mới. 
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  console.log(user)

  const handleChange = (e) => { //Khi người dùng nhập hoặc thay đổi giá trị trong một trường dữ liệu, hàm handleChange được gọi và cập nhật trạng thái user với giá trị mới cho trường dữ liệu cụ thể mà họ đã tương tác.
    setUser((prev) => { //để cập nhật biến trạng thái user
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("auth/register", {
        ...user,
        img: url,
      });
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Tạo tài khoản mới</h1>
          <label htmlFor="">Tên người dùng</label>
          <input
            name="username"
            type="text"
            placeholder="ví dụ: `john dove`"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Mật khẩu</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Ảnh đại diện</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Khoa</label>
          <input
            name="country"
            type="text"
            placeholder="TKDH"
            onChange={handleChange}
          />
          <button type="submit">Tham gia</button>
        </div>
        <div className="right">
          <h1>Tôi muốn kinh doanh</h1>
          <div className="toggle">
            <label htmlFor="">Kích hoạt tài khoản kinh doanh</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Số điện thoại</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Mô tả</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;