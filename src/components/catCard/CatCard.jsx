import React from 'react';
import { Link } from 'react-router-dom';
import "./CatCard.scss";

const CatCard = ({ item }) => {
  const { title, desc, img, cat } = item;

  return (
    <Link to={`/gigs?cat=${cat}`}>
      <div className='catcard'>
        <img src={img} alt={title} />
        <span className="desc">{desc}</span>
        <span className="title">{title}</span>
      </div>
    </Link>
  );
}

export default CatCard;
