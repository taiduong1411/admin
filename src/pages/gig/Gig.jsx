import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Có gì đó không ổn!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              Besign {">"} Thiết kế đồ họa {">"}
            </span>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Có gì đó không ổn!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                 src={dataUser.img || "/images/noavatar.png"} 
                 alt="" 
              />

                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                    <img src="\images\star.png" alt="" key={i} />
                  ))}
              <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => (
                <img key={img} src={img} alt="" />
              ))}
            </Slider>
            <h2>Thông tin sản phẩm</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Có gì đó không ổn"
            ) : (
              <div className="seller">
                <h2>Thông tin người bán</h2>
                <div className="user">
              <img 
                src={dataUser.img || "\images\noavatar.png"} 
                alt="" 
              />
              <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                  <img src="\images\star.png" alt="" key={i} />
                  ))}
                <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <button>Liên hệ</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">Khoa</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                  <span className="title">Tham gia từ</span>
                  <span className="desc">10/2023</span>
                </div>
                <div className="item">
                  <span className="title">Thời gian phản hồi</span>
                  <span className="desc">4 tiếng</span>
                </div>
                <div className="item">
                  <span className="title">Ngày cuối cùng tạo</span>
                  <span className="desc">1 ngày</span>
                </div>
                <div className="item">
                  <span className="title">Ngôn ngữ</span>
                  <span className="desc">Tiếng Việt</span>
                </div>
              </div>

              <hr/>

              <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>{data.price} VND</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
              <img src="\images\clock.png" alt="" />
              <span>{data.deliveryDate} Ngày giao dịch</span>
            </div>
            <div className="item">
              <img src="\images\recycle.png" alt="" />
              <span>{data.revisionNumber} Lần xem xét</span>
            </div>
          </div>
          <div className="features">
            {data.features.map(feature=>(
              <div className="item" key={feature}>
                <img src="\images\greencheck.png" alt="" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Link to={`/pay/${id}`}>
          <button>Tiếp tục giao dịch</button>
          </Link>
        </div>
      </div>
      )}
    </div>
  );
}

export default Gig;