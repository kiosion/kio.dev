import React, { useState, useEffect } from 'react';
import { client } from '../../../client';
import Carousel from './Carousel/Carousel';
import Hover from '../../Utils/Hover/Hover';

const Projects = () => {
  const [data, setData] = useState<any>([]);
  const [index, setIndex] = useState<number>(0);
  const [filterItems, setFilterItems] = useState<number>(2);
  const [filterIndicator, setFilterIndicator] = useState<number>(2);

  const filters = [
    'design',
    'development',
    'all work',
  ];

  const handleFilterChange = (item: number) => {
    setFilterItems(item);
    setFilterIndicator(item);
  }

  const handleFilterIndicatorChange = (item: number) => {
    setFilterIndicator(item);
  }

  const isFiltered = () => {
    return filterIndicator ? ` indicator__${filterIndicator}` : '';
  }

  const handleFilterHover = (event: string, item: number) => {
    handleFilterIndicatorChange(event === 'enter' ? item : filterItems);
  }

  const changeState = (num: number) => {
    setIndex(num);
  };

  useEffect(() => {
    const query = `*[!(_id in path('drafts.**')) && _type == "item"]{
          title,
          slug,
          "image": pimage.asset->url,
          category,
          priority,
      } | order(priority asc)`;
    client
      .fetch(query)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }, []);

  useEffect(() => {
    console.log('index: ', index);
  }, [index]);
    
  return (
    <div className="app__section">
      <div className="app__section-title">Projects</div>
      <div className="app__section-projects">
        <div className="section-projects__upper">
          {/* Filters */}
          <div className="section-projects__upper-filters">
            <div className={"filters__filter-item-indicator" + isFiltered()} />
            {filters.map((filter, index) => (
              <Hover>
                <div
                  className={`filters__filter-item`}
                  onClick={() => handleFilterChange(index)}
                  onMouseEnter={() => handleFilterHover('enter', index)}
                  onMouseLeave={() => handleFilterHover('leave', index)}
                >{filter}</div>
              </Hover>
            ))}
          </div>
          {/* Description, pulled from data arr using 'index' */}
          <div className="section-projects__upper-desc">
          </div>
          {/* Horiz divider */}
          <div className="section-projects__upper-divider"></div>
        </div>
      </div>
      {/* Todo: refactor carousel so border is fixed as a vertical divider */}
      <Carousel itemData={ data } changeState={ changeState }/>
    </div>
  );
};

export default Projects;
