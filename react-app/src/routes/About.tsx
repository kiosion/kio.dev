import React from 'react';
import { Helmet } from 'react-helmet';
import { AboutSection } from '../components';

const About = () => {
  return (
    <div className="app__content">
      <Helmet>
        <title>kio.dev / about</title>
      </Helmet>
      <AboutSection />
    </div>
  );
};

export default About;
