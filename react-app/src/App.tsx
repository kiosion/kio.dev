import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home, About, Post, Blog, Project } from './routes';
import './App.scss';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={ <Home /> } path='/' />
				<Route element={ <About /> } path='/about' />
				<Route element={ <Post /> } path='/blog/*' />
				<Route element={ <Blog /> } path='/blog' />
				<Route element={ <Project /> } path='/project/*' />
			</Routes>
		</BrowserRouter>
		// <div className="app">
		// 	<Header />
		// 	<Work />
		// 	<Footer />
		// </div>
	);
}

export default App;
