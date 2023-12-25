import React from 'react';
import Slider from 'infinite-react-carousel';
import CatCard from '../catCard/CatCard';
import "./Slide.scss";

const Slide = ({ slidesToShow, arrowsScroll, cards }) => {
  // Kiểm tra xem cards có tồn tại và có phải là mảng không
  if (!cards || !Array.isArray(cards)) {
    // Trả về một phần tử tùy chọn nếu không có cards
    return <div>No cards available</div>;
  }

  return (
    <div className='slide'>
      <div className="container">
        <div>
          <p>Hãy chọn xem những danh mục dưới đây</p>
        </div>
        <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
          {cards.map(card => (
            <CatCard key={card.id} item={card} />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Slide;
