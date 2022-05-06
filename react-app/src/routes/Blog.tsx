import React from 'react';

import { Header, Footer } from '../components';

const Blog = () => {
  return (
      <div className="app">
            <Header view={"blog"} route={""} />
            <Footer />
        </div>
  );
}

export default Blog;
