import React from 'react';
import { Header, Footer, Posts } from '../components';

const Blog = () => {
  return (
        
    <div className="app">
      <Header view={'blog'} route={['', 'home']} />
      <Posts />
      <Footer view={'relative'} />
    </div>
  );
};

export default Blog;
