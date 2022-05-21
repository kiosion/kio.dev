import React from 'react';
import { Helmet } from 'react-helmet';
import { Posts } from '../components';

const Blog = () => {
  return (
    <div className="app__content">
      <Helmet>
        <title>kio.dev / blog</title>
      </Helmet>
      <Posts />
    </div>
  );
};

export default Blog;
