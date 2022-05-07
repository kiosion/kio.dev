import React from 'react';

import { Header, Footer } from '../components';

const About = () => {
    return (
        <div className="app">
            <Header view={"about"} route={["", "home"]} />
            <Footer view={"fixed"} />
        </div>
    );
}

export default About;
