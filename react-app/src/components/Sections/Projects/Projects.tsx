import React, { useState, useEffect } from 'react';
import { client } from '../../../client';

import Carousel from './Carousel/Carousel';

import './Projects.scss';
const Projects = () => {
  const [data, setData] = useState<any>([]);

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
    
  return (
    <div className="app__projectsSection">
      <div className="carouselContainer">
        <Carousel itemData={ data } />
      </div>
    </div>
  );
};

export default Projects;
