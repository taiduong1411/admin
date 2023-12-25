import React from 'react'
import "./Home.scss"
import Featured from '../../components/featured/Featured'
import TrustedBy from '../../components/trustedBy/TrustedBy'
import Slide from '../../components/slide/Slide'
import {cards} from "../../data"
//import Catcard from '../../components/catCard/CatCard'
import { projects } from '../../data'
import ProjectCard from '../../components/projectCard/ProjectCard'

const Home = () => {
  return (
    <div className='home'>
      <Featured/>
      <TrustedBy/>
      <Slide slidesToShow={4} arrowsScroll={4} cards={cards} /> 
      <div className="features"> 
        <div className="container">
          <div className="item">
            <h1>Cả thế giới nghệ thuật chỉ bằng một cú nhấp</h1>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Điều tốt nhất cho mọi chi phí
            </div>
            <p>
              Tìm thấy sản phẩm chất lượng cao ở mọi mức giá
            </p>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Điều tốt nhất cho mọi chi phí
            </div>
            <p>
              Tìm thấy sản phẩm chất lượng cao ở mọi mức giá
            </p>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Điều tốt nhất cho mọi chi phí
            </div>
            <p>
              Tìm thấy sản phẩm chất lượng cao ở mọi mức giá
            </p>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Điều tốt nhất cho mọi chi phí
            </div>
            <p>
              Tìm thấy sản phẩm chất lượng cao ở mọi mức giá
            </p>
          </div>
          <div className="item"> 
            <video src="\images\video.mp4" controls></video> 
          </div>
        </div>
      </div>
      <div className="features dark"> 
        <div className="container">
          <div className="item">
            <h1>Besign kinh doanh</h1>
            <h1>Một giải pháp kinh doanh sản phẩm đồ họa cho đội nhóm</h1>
            <p>Nâng cấp lên gói cao cấp để sở hữu những sản phẩm đồ họa đỉnh cao</p>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Kết nối tới sinh viên với những kinh nghiệm kinh doanh
            </div>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Kết nối với những tài năng thực thụ bởi những người quản lí xuất sắc
            </div>
            <div className="title">
              <img src="\images\check.png" alt="" />
              Quản lí công việc và nâng cao năng suất
            </div>
            <button>Khám phá Besign kinh doanh</button>
          </div>
          <div className="item"> 
            <img src="\images\pic1.png" alt="" /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home