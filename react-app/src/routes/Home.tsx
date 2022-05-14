import React from 'react';
import { Header, Footer, Projects } from '../components';

const Home = () => {
  return (
    <div className="app">
      <Header view={'home'} route={['', '']} />
      <Projects />
      <Footer view={'fixed'}/>
    </div>
  );
};

export default Home;
