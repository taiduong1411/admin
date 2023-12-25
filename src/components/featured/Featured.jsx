import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

const Featured = () => {
    const [input,setInput] = useState("");
    const navigate = useNavigate()

    const handleSubmit = ()=>{
        navigate(`/gigs?search=${input}`);
    }
  return (
    <div className='featured'>
        <div className="container">
            <div className="left">
                <h1>Hãy tìm cho mình một thiết kế đẹp và thật sáng tạo</h1>
                <div className="search">
                    <div className="searchInput">
                        <img src="\images\search.png" alt="" />
                        <input type="text" placeholder='Thử "trừu tượng"' 
                        onChange={e=>setInput(e.target.value)} 
                        />
                    </div>
                    <button onClick={handleSubmit}>Search</button>
                </div>
                <div className="popular">
                    <span>Popular:</span>
                    <button>Con người</button>
                    <button>Công trình</button>
                    <button>Đồ họa</button>
                    <button>Cách điệu</button>
                </div>
            </div>
            <div className="right">
                <img src="\images\graphic.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Featured