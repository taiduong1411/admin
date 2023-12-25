import React, { useEffect, useState } from 'react'
import "./Navbar.scss"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import newRequest from '../../utils/newRequest';


const Navbar = () => {

  const [active,setActive] = useState(false) // sự kiện scroll thì navbar đổi màu
  const [open,setOpen] = useState(false) // sự kiện ấn vào chỗ ava nhảy popup

  const {pathname} = useLocation() //dùng pathname như là để xác định trang nào thì sẽ dùng hiệu ứng của navbar

const isActive = ()=>{
  window.scrollY > 0 ? setActive(true) : setActive(false) //cuộn theo chiều dọc nếu mà đúng thì sẽ active và ngược lại
}

  useEffect(()=>{   // đoạn này là dùng effect scroll để đổi trạng thái
    window.addEventListener("scroll", isActive);

    return ()=>{
      window.removeEventListener("scroll", isActive)
    }
  },[]);

  const currentUser= JSON.parse(localStorage.getItem("currentUser")); //người dùng hiện tại sẽ dc hiện ở trên ava luôn

  const navigate = useNavigate();

  const handleLogout = async ()=>{
    try{
      await newRequest.post("/auth/logout")
      localStorage.setItem("currentUser", null);
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  };

  return ( // đoạn path name ngay dưới có nghĩa là nếu đang ko ở trong homepage thì navbar sẽ ko có màu xanh tức là sẽ ko active
    <div className={active || pathname !=="/" ? "navbar active" : "navbar"}> 
      <div className="container">
        <div className="logo">
          <Link to ="/" className='link'> 
            <span className='text'>Besign</span>
          </Link>
          <span className='dot'>.</span>
        </div>
        <div className="links"> 
          <span>Besign kinh doanh</span>
          <span>Khám phá</span>
          <span>Tiếng Việt</span>
          
          {!currentUser?.isSeller && <span>Trở thành người bán</span>}
           
          {currentUser ?( //đoạn chỗ img là để thay link ava
            <div className="user" onClick={()=>setOpen(!open)}> 
              <img 
                src={currentUser.img || "/images/noavatar.png"} //đoạn này se dùng ảnh của ng dùng đăng nhập, nếu ng dùng chưa có ava thì sẽ auto là noavatar
                alt="" 
              /> 
              <span>{currentUser?.username}</span> 
              {open && (<div className="option"> 
                {currentUser?.isSeller && ( //nếu ng dùng là seller thì sẽ hiện những cái dưới
                    <>
                      <Link className='link' to="/mygigs">Sản phẩm của tôi</Link>
                      <Link className='link' to="/add">Thêm sản phẩm mới</Link>
                    </>
                  )}
                  <Link className='link' to="/orders">Đơn đặt</Link>
                  <Link className='link' to="/messages">Tin nhắn</Link>
                  <Link className='link' onClick={handleLogout}>
                    Đăng xuất
                  </Link>
              </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Đăng nhập</Link>
              <Link className="link" to="/register">
                <button>Tham gia</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !=='/') && (
        <>
        <hr />
        <div className="menu">
        <Link className="link menuLink" to="/">
              Graphics & Design
            </Link>
            <Link className="link menuLink" to="/">
              Video & Animation
            </Link>
            <Link className="link menuLink" to="/">
              Writing & Translation
            </Link>
            <Link className="link menuLink" to="/">
              AI Services
            </Link>
            <Link className="link menuLink" to="/">
              Digital Marketing
            </Link>
            <Link className="link menuLink" to="/">
              Music & Audio
            </Link>
            <Link className="link menuLink" to="/">
              Programming & Tech
            </Link>
            <Link className="link menuLink" to="/">
              Business
            </Link>
            <Link className="link menuLink" to="/">
              Lifestyle
            </Link>
        </div>
        <hr />
        </>
      )}
    </div>
  );
};

export default Navbar