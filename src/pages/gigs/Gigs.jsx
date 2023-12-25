import React, { useEffect, useRef, useState } from 'react';
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from '../../utils/newRequest';
import { useLocation } from 'react-router-dom';


function Gigs() {

  const [sort, setSort ] = useState("price-asc");
  const [open, setOpen ] = useState(false); //sự kiện bấm mở cái lọc
  const minRef = useRef();
  const maxRef = useRef();

  const {search} = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = ()=>{
    refetch();
  };


  return (
    <div className='gigs'>
      <div className="container">
        <span className="breadcrumbs">BESIGN {">"} Thiết kế đồ họa {">"}</span>
        <h1>Sinh viên nghệ thuật</h1>
        <p>Khám phá tới tận biên giới của nghệ thuật cùng sinh viên</p>
        <div className="menu">
          <div className="left">
            <span>Mức giá</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Tìm kiếm</button>
          </div>
          <div className="right"> 
            <span className="sortBy">Sort By</span> 
            <span className="sortType">
              {sort === "price-asc" && " Giá Thấp đến cao"}
              {sort === "price-desc" && "Giá Cao đến thấp"}
              {sort === "sales" && "Bán chạy nhất"}
            </span>
            <img src="\images\down.png" alt="" onClick={() => setOpen(!open)} />
              {open && (
              <div className="rightMenu">
                <span onClick={() => reSort("price-asc")}>Giá Thấp đến cao</span>
                <span onClick={() => reSort("price-desc")}>Giá Cao đến thấp</span>
                <span onClick={() => reSort("sales")}>Bán chạy nhất</span>
              </div>
              )}
          </div>
        </div>
        <div className="cards"> 
          {isLoading // kiểm tra xem một truy vấn đang trong quá trình thực thi (đang chạy) hay không.
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)} 
        </div>
      </div>
    </div>
  );
} 

export default Gigs;