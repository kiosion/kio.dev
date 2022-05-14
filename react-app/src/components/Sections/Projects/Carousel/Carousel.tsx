import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Hover from '../../../Utils/Hover/Hover';
import CarouselItem from '../CarouselItem/CarouselItem';

import './Carousel.scss';
const Carousel: React.FunctionComponent<any> = ({ itemData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dir, setDir] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
    
  const carouselLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDir('left');
    }
  };
  const carouselRight = () => {
    if (currentIndex < itemData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDir('right');
    }
  };

  useEffect(() => {
    console.log('\n');
    console.log('currentIndex: ', currentIndex);
    console.log('dir: ', dir);
    console.log('numItems: ', itemData.length);
    const carouselItem = document.getElementById(`carouselItem-${currentIndex}`) as HTMLElement | null;
    const slide = document.querySelector('.carouselControls__carouselSlider') as HTMLElement | null;
    const section = document.querySelector('.app__projectsSection') as HTMLElement | null;

    if (!carouselItem || !slide || !section) return;

    const sectionPadding: number = parseInt(getComputedStyle(section).paddingLeft, 10);
    const sectionMargin: number = parseInt(getComputedStyle(section).marginLeft, 10);
    const itemOffset: number = carouselItem.offsetLeft;
    const itemWidth: number = parseInt(getComputedStyle(carouselItem).width, 10);
    console.log('sectionPadding: ', sectionPadding);
    console.log('sectionMargin: ', sectionMargin);
    console.log('itemWidth: ', itemWidth);
    console.log('itemOffset: ', itemOffset);

    const calcTranslate = () => {
      if (dir === 'right' && !hasScrolled && currentIndex == 1) {
        setHasScrolled(true);
        return itemOffset - sectionPadding - sectionMargin;
      }
      return itemOffset;
    };
    console.log('translate value: ', calcTranslate());
    slide.style.transform = `translateX(-${calcTranslate()}px)`;
  }, [currentIndex, dir]);

  return (
    <div className="carouselContainer__carouselControls">
      <div className="carouselControls__carouselButtons app__no-select">
        <Hover>
          <div 
            className="carouselButton"
            onClick={() => {
              carouselLeft();
            }}
          >&lt;</div>
        </Hover>
        <Hover>
          <div 
            className="carouselButton"
            onClick={() => {
              carouselRight();
            }}
          >&gt;</div>
        </Hover>
      </div>
      <div className="carouselControls__carouselSlider">
        {itemData.map((item: any, index: number) => (
          <CarouselItem props={{
            src: item.image,
            url: item.slug.current,
            title: item.title,
            cat: item.category,
            id: `carouselItem-${index}`,
          }} key={item.title + '-' + index} />
        ))}
      </div>
      
    </div>
  );
};

export default Carousel;
