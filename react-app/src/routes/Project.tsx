import React from 'react';
import { Header, Footer } from '../components';

const Project = () => {
  return (
    <div className="app">
      <Header view={'projects'} route={['projects', 'projects']} />
      <div>
        <h1>Project</h1>
      </div>
      <Footer />
    </div>
  );
};

export default Project;
