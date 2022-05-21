import React from 'react';
import { Helmet } from 'react-helmet';
import { HomeSection } from '../components';

const Home = () => {
  return (
    <div className="app__content">
      <Helmet>
        <title>kio.dev / home</title>
      </Helmet>
      <HomeSection />
    </div>
  );
};

export default Home;
