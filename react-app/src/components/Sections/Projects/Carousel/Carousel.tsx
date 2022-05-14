import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Hover from '../../../Utils/Hover/Hover';
import CarouselItem from '../CarouselItem/CarouselItem';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';

import './Carousel.scss';
const Carousel: React.FunctionComponent<any> = ({ itemData, changeState }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dir, setDir] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [controlsWidth, setControlsWidth] = useState(0);
    
  const carouselLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      changeState(currentIndex - 1);
      setDir('left');
    }
  };
  const carouselRight = () => {
    if (currentIndex < itemData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      changeState(currentIndex + 1);
      setDir('right');
    }
  };

  const handleScroll = (dir: string) => dir === 'down' ? carouselRight() : carouselLeft();

  const handleResize = () => {
    setHasScrolled(false);
    const container = document.querySelector('.carouselContainer__carouselControls') as HTMLElement | null;
    !container ? setControlsWidth(window.innerWidth) : setControlsWidth(container.clientWidth);
  };

  // Handle buttons
  useEffect(() => {
    const buttons = document.querySelector('.carouselControls__carouselButtons') as HTMLElement | null;
    if (!buttons) return;
    window.addEventListener('resize', handleResize);
    handleResize();
    buttons.style.transform = `translateY(29rem) translateX(${controlsWidth - buttons.clientWidth}px)`;
    buttons.style.width = '6rem';
    return () => window.removeEventListener('resize', handleResize);
  }, [controlsWidth]);

  useEffect(() => {
    const carouselItem = document.getElementById(`carouselItem-${currentIndex}`) as HTMLElement | null;
    const slide = document.querySelector('.carouselControls__carouselSlider') as HTMLElement | null;
    const section = document.querySelector('.app__projectsSection') as HTMLElement | null;
    if (!carouselItem || !slide || !section) return;
    const calcTranslate = () => {
      if (dir === 'right' && !hasScrolled && currentIndex == 1) {
        setHasScrolled(true);
        return carouselItem.offsetLeft - parseInt(getComputedStyle(section).paddingLeft, 10) - parseInt(getComputedStyle(section).marginLeft, 10);
      }
      return carouselItem.offsetLeft;
    };
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
      <ReactScrollWheelHandler
        timeout={50}
        rightHandler={() => handleScroll('up')}
        leftHandler={() => handleScroll('down')}
        upHandler={(e) => handleScroll('up')}
        downHandler={(e) => handleScroll('down')}
      >
        <div className="carouselControls__carouselSlider">
          {itemData.map((item: any, index: number) => (
            <CarouselItem props={{
              src: item.image + '?h=500',
              url: item.slug.current,
              title: item.title,
              cat: item.category,
              id: `carouselItem-${index}`,
            }} key={item.title + '-' + index} />
          ))}
        </div>
      </ReactScrollWheelHandler>
    </div>
  );
};

export default Carousel;
