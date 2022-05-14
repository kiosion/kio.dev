import React, { useState, useEffect } from 'react';
import { client } from '../../../client';

import Carousel from './Carousel/Carousel';

import './Projects.scss';
const Projects = () => {
  const [data, setData] = useState<any>([]);
  const [index, setIndex] = useState<number>(0);

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
    <div className="app__projectsSection">
      <div className="app__section-title">Featured</div>
      <Carousel itemData={ data } changeState={ changeState }/>
    </div>
  );
};

export default Projects;
