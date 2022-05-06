import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Hover from '../../Hover/Hover';
import CarouselItem from '../CarouselItem/CarouselItem';

import './Carousel.scss';
const Carousel: React.FunctionComponent<any> = ({ itemData }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    
    const carouselLeft = () => {
        currentIndex > 0 && setCurrentIndex(currentIndex - 1);
    }
    const carouselRight = () => {
        currentIndex < itemData.length - 1 && setCurrentIndex(currentIndex + 1);
    }

    return (
        <div className="grid__carousel">
            {itemData.map((item: any, index: number) => (
                <CarouselItem props={{
                    src: item.image,
                    url: item.slug.current,
                    title: item.title,
                    cat: item.category
                }} key={item.title + '-' + index} />
            ))}
            <Hover>
                <div 
                    className="grid__carousel-button carousel__button-left"
                    onClick={() => {
                        carouselLeft();
                    }}
                >
                </div>
            </Hover>
            <Hover>
                <div 
                    className="grid__carousel-button carousel__button-right"
                    onClick={() => {
                        carouselRight();
                    }}
                >
                </div>
            </Hover>
        </div>
    );
}

export default Carousel;
