import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundComponent } from '../components/ErrorBounds';
import { Header, Footer, Projects } from '../components';

const Home = () => {
  return (
    <div className="app">
      <Header view={'home'} route={['', '']} />
      <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
        <Projects />
      </ErrorBoundary>
      <Footer view={'fixed'}/>
    </div>
  );
};

export default Home;
