import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { images } from '../../../constants';
import Hover from '../../Utils/Hover/Hover';

import './Header.scss';
const Header: React.FunctionComponent<any> = ({ view, route: [page, title] }) => {
  const [currentView, setCurrentView] = useState(view);
  const [backRoute, setBackRoute] = useState([page, title]);
  const [filterItems, setFilterItems] = useState(1);
  const [backHover, setBackHover] = useState(false);
  const [linkHover, setLinkHover] = useState(view);
  const [filterIndicator, setFilterIndicator] = useState(1);
  const [filterState, setFilterState] = useState(filterIndicator);

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
    case 0:
      return ' indicator__all';
    default:
    case 1:
      return ' indicator__1';
    case 2:
      return ' indicator__2';
    }
  };

  const handleLinkIndicator = () => {
    switch (linkHover) {
    case '0':
    case 'home':
      return ' indicator__0';
    case 'about':
      return ' indicator__1';
    case 'socials':
      return ' indicator__2';
    case 'blog':
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
                >
                                    design
                </div>
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
                >
                                    development
                </div>
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
                >
                                    all work
                </div>
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
                  >
                                        &lt; {backRoute[1]}
                  </div>
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
            <Hover
              state={isActive('about') ? false : true}
            >
              <Link to="/about">
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive('about')}
                  onMouseEnter={() => {
                    handleLinkHover('enter', 'about');
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', 'about');
                  }}
                >
                                    about
                </div>
              </Link>
            </Hover>
            <Hover
              state={isActive('socials') ? false : true}
            >
              <Link to="/socials">
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive('social')}
                  onMouseEnter={() => {
                    handleLinkHover('enter', 'socials');
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', 'socials');
                  }}
                >
                                    social
                </div>
              </Link>
            </Hover>
            <Hover
              state={isActive('blog') ? false : true}
            >
              <Link to="/blog">
                <div 
                  className={'header__linkitem linkitem__secondary' + isActive('blog')}
                  onMouseEnter={() => {
                    handleLinkHover('enter', 'blog');
                  }}
                  onMouseLeave={() => {
                    handleLinkHover('leave', 'blog');
                  }}
                >
                                    blog
                </div>
              </Link>
            </Hover>
          </div>
        </motion.div>

      </motion.div>

      <div className="app__section-divider"></div>

    </div>
  );
};

export default Header;
