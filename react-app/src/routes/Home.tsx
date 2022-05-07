import React from 'react';

import { Header, Footer, Work } from '../components';

const Home = () => {
    return (
        <div className="app">
            <Header view={"home"} route={["", ""]} />
            <Work />
            <Footer view={"fixed"}/>
        </div>
    );
}

export default Home;
