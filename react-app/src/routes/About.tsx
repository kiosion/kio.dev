import React from 'react';
import { Header, Footer, AboutSection } from '../components';

const About = () => {
  return (
    <div className="app">
      <Header view={'about'} route={['', 'home']} />
      <AboutSection />
      <Footer view={'fixed'} />
    </div>
  );
};

export default About;
