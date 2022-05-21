import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Header, Footer } from './components';
import { Home, About, Post, Blog, Project, Projects, Error } from './routes';
import './styles/App.scss';

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ Error }>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={ <Home /> } path='/' />
          <Route element={ <About /> } path='/about' />
          <Route element={ <Post /> } path='/blog/p/:slug' />
          {/* <Route element={ <Tag /> } path='/blog/t/:slug' /> */}
          <Route element={ <Blog /> } path='/blog' />
          <Route element={ <Projects /> } path='/projects' />
          <Route element={ <Project /> } path='/projects/:slug' />
          <Route element={ <Navigate to="/" replace /> } path="*" />
        </Routes>
        <Footer view={'relative'} />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
