import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundComponent } from '../components/ErrorBounds';
import { Header, Footer, AboutSection } from '../components';

const About = () => {
    return (
        <div className="app">
            <Header view={"about"} route={["", "home"]} />
            <ErrorBoundary FallbackComponent={ ErrorBoundComponent }>
                <AboutSection />
            </ErrorBoundary>
            <Footer view={"fixed"} />
        </div>
    );
}

export default About;
