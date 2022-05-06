import React from 'react';

import { Header, Footer, Work } from '../components';

const Home = () => {
	return (
		<div className="app">
			<Header view={"home"} />
			<Work />
			<Footer />
		</div>
	);
}

export default Home;
