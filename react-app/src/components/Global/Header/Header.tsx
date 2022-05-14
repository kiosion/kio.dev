import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { images } from '../../../constants';
import Hover from '../../Utils/Hover/Hover';

import './Header.scss';
const Header: React.FunctionComponent<any> = ({ view, route: [page, title] }) => {
  const [currentView, setCurrentView] = useState(view);
  const [backRoute, setBackRoute] = useState([page, title]);
  const [filterItems, setFilterItems] = useState(0);
  const [backHover, setBackHover] = useState(false);
  const [linkHover, setLinkHover] = useState(view);
  const [filterIndicator, setFilterIndicator] = useState(0);
  const [filterState, setFilterState] = useState(filterIndicator);

  const navLinks = [
    'about',
    'projects',
    'blog',
  ];

  const filters = [
    'design',
    'development',
    'all work',
  ];

  useEffect(() => {
    setCurrentView(view);
    setBackRoute([page, title]);
  }, [page, title, view]);

  const isActive = (view: string) => {
    return currentView === view ? ' linkitem__active' : '';
  };

  const isBackHover = () => {
    return backHover ? ' linkitem__placeholder-hover' : '';
  };

  const isFiltered = (item: number) => {
    return filterItems === item ? ' filteritem__active' : '';
  };

  const handleFilterChange = (item: number) => {
    setFilterItems(item);
    setFilterIndicator(item);
  };

  const handleFilterIndicatorChange = (item: number) => {
    setFilterIndicator(item);
  };

  const handleFilterIndicator = () => {
    switch (filterIndicator) {
    default:
    case 0:
      return ' indicator__all';
    case 1:
      return ' indicator__1';
    case 2:
      return ' indicator__2';
    }
  };

  const handleLinkIndicator = () => {
    switch (linkHover) {
    case 'home':
      return ' indicator__0';
    case navLinks[0]:
      return ' indicator__1';
    case navLinks[1]:
      return ' indicator__2';
    case navLinks[2]:
      return ' indicator__3';
    }
  };

  const handleBackHover = (event: string) => {
    setBackHover(event === 'enter' ? true : false);
  };

  const handleLinkHover = (event: string, item: string) => {
    setLinkHover(event === 'enter' ? item : view);
  };

  const handleFilterHover = (event: string, item: number) => {
    handleFilterIndicatorChange(event === 'enter' ? item : filterItems);
  };

  return (
    <div id="home" className="app__header">
      <motion.div
        whileInView={{ y: [0, 0], opacity: [0, 1] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="app__header-row app__no-select"
      >
        <motion.div
          whileInView={{ x: [-25, 0], opacity: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="app__header-col"
        >
          <Hover>
            <Link to="/">
              <div className="app__header-logo">
                <img src={ images.logo_black } alt="logo" />
              </div>
            </Link>
          </Hover>
        </motion.div>

        <motion.div
          whileInView={{ x: [25, 0], opacity: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="app__header-col"
        >
          {currentView === 'home' ? (
            <div className="app__header-list">
              <div className={'filterItem__indicator' + handleFilterIndicator()} />
              <Hover>
                <div 
                  className={'header__linkitem linkitem__primary' + isFiltered(1)}
                  onMouseEnter={() => {
                    handleFilterHover('enter', 1);
                  }}
                  onMouseLeave={() => {
                    handleFilterHover('leave', 1);
                  }}
                  onClick={() => {
                    handleFilterChange(1);
                  }}
                >{filters[0]}</div>
              </Hover>
              <Hover>
                <div 
                  className={'header__linkitem linkitem__primary' + isFiltered(2)}
                  onMouseEnter={() => {
                    handleFilterHover('enter', 2);
                  }}
                  onMouseLeave={() => {
                    handleFilterHover('leave', 2);
                  }}
                  onClick={() => {
                    handleFilterChange(2);
                  }}
                >{filters[1]}</div>
              </Hover>
              <Hover>
                <div 
                  className={'header__linkitem linkitem__primary' + isFiltered(0)}
                  onMouseEnter={() => {
                    handleFilterHover('enter', 0);
                  }}
                  onMouseLeave={() => {
                    handleFilterHover('leave', 0);
                  }}
                  onClick={() => {
                    handleFilterChange(0);
                  }}
                >{filters[2]}</div>
              </Hover>
            </div>
          ) : (
            <div className="app__header-list">
              <div className={'header__linkitem linkitem__placeholder' + isBackHover()} />
              <Hover>
                <Link to={'/' + backRoute[0]}>
                  <div 
                    className="header__linkitem linkitem__primary"
                    onMouseEnter={() => {
                      handleBackHover('enter');
                    }}
                    onMouseLeave={() => {
                      handleBackHover('leave');
                    }}
                  >&lt; {backRoute[1]}</div>
                </Link>
              </Hover>
            </div>
          )}

        </motion.div>

        <motion.div
          whileInView={{ x: [25, 0], opacity: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="app__header-col"
        >
          <div className="app__header-list">
            <div className={'linkItem__indicator' + handleLinkIndicator()} />
            {navLinks.map((item, index) => (
              <Hover key={index} state={isActive(navLinks[index]) ? false : true}>
                <Link to={'/' + item}>
                  <div 
                    className={'header__linkitem linkitem__secondary' + isActive(navLinks[index])}
                    onMouseEnter={() => {
                      handleLinkHover('enter', navLinks[index]);
                    }}
                    onMouseLeave={() => {
                      handleLinkHover('leave', navLinks[index]);
                    }}
                  >{navLinks[index]}</div>
                </Link>
              </Hover>
            ))}
            {/* <Hover
              state={isActive('about') ? false : true}
            >
              <Link to={'/' + navLinks[0]}>
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive(navLinks[0])}
                  onMouseEnter={() => {
                    handleLinkHover('enter', navLinks[0]);
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', navLinks[0]);
                  }}
                >{navLinks[0]}</div>
              </Link>
            </Hover>
            <Hover
              state={isActive(navLinks[1]) ? false : true}
            >
              <Link to={'/' + navLinks[1]}>
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive(navLinks[1])}
                  onMouseEnter={() => {
                    handleLinkHover('enter', navLinks[1]);
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', navLinks[1]);
                  }}
                >{navLinks[1]}</div>
              </Link>
            </Hover>
            <Hover
              state={isActive(navLinks[2]) ? false : true}
            >
              <Link to={'/' + navLinks[2]}>
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive(navLinks[2])}
                  onMouseEnter={() => {
                    handleLinkHover('enter', navLinks[2]);
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', navLinks[2]);
                  }}
                >{navLinks[2]}</div>
              </Link>
            </Hover> */}
          </div>
        </motion.div>

      </motion.div>

      <div className="app__section-divider"></div>

    </div>
  );
};

export default Header;
