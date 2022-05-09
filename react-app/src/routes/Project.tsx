import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundComponent } from '../components/ErrorBounds';
import { Header, Footer } from '../components';

const Project = () => {
    return (
        <div className="app">
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <Header view={"projects"} route={["projects", "projects"]} />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <div>
                    <h1>Project</h1>
                </div>
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <Footer />
            </ErrorBoundary>
        </div>
    );
}

export default Project;
