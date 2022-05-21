import React from 'react';
import { Helmet } from 'react-helmet';
import { Projects } from '../components';

const Home = () => {
  return (
    <div className="app__content">
      <Helmet>
        <title>kio.dev / projects</title>
      </Helmet>
      <Projects />
    </div>
  );
};

export default Home;
