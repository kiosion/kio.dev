import React from 'react';
import { useParams } from 'react-router-dom';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundComponent } from '../components/ErrorBounds';
import { Header, Footer, PostSection } from '../components';

const Post = () => {
  const { slug } = useParams();

  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
        <Header view={'blog'} route={['blog', 'all posts']} />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
        <PostSection slug={ slug } />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
        <Footer view={'relative'} />
      </ErrorBoundary>
    </div>
  );
};

export default Post;
