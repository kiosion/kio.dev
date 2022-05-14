import React from 'react';
import { Link } from 'react-router-dom';
import Hover from '../../../Utils/Hover/Hover';

import './CarouselItem.scss';
const CarouselItem: React.FunctionComponent<any> = ({ props }) => {
  const { src, url, title, cat, id } = props;
  return (
    <div className="carousel__carouselItem app__no-select" id={id}>
      <Link to={'/project/' + url} >
        <Hover>
          <div className="carouselItem__frame">
            <img src={src} alt={title} />
          </div>
        </Hover>
      </Link>
      <div className="carouselItem__sub">
        <span className="carouselItem__sub-title">{title}</span>
        <Hover>
          <span className="carouselItem__sub-cat">#{cat}</span>
        </Hover>
      </div>
    </div>
  );
};

export default CarouselItem;
