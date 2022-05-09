import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundComponent } from '../components/ErrorBounds';
import { Header, Footer, Posts } from '../components';

const Blog = () => {
    return (
        
        <div className="app">
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <Header view={"blog"} route={["", "home"]} />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <Posts />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <Footer view={"relative"} />
            </ErrorBoundary>
        </div>
    );
}

export default Blog;
