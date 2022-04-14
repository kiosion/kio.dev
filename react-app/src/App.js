import React from 'react';

import { Footer, Header, Work } from './container';
import './App.scss';

const App = () => {
	return (
	<div className="app" onDrag="">
		<Header />
		<Work />
		<Footer />
	</div>
	);
}

export default App;
