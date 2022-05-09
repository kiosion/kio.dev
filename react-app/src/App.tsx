import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Home, About, Post, Blog, Project, Error, ErrorPage } from './routes';
import './App.scss';

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ Error }>
      <BrowserRouter>
        <Routes>
          <Route element={ <Home /> } path='/' />
          <Route element={ <About /> } path='/about' />
          <Route element={ <Post /> } path='/blog/p/:slug' />
          {/* <Route element={ <Tag /> } path='/blog/t/:slug' /> */}
          <Route element={ <Blog /> } path='/blog' />
          <Route element={ <Project /> } path='/projects/*' />
          <Route element={ <Navigate to="/" replace /> } path="*" />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
