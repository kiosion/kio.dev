import React from 'react';
//import { motion } from 'framer-motion';

import './FilterBar.scss';
const FilterBar = () => {
  return (
	<nav className="app__filterbar">
    <ul className="app__filterbar-links">
      {['art & design', 'music', 'development', 'blogs'].map((item) => (
        // TODO: set id to item
        <li className="app__flex app__cursor-link p-text" key={`link-${item}`}>
          <a href={`#${item}`}>{item}</a>
        </li>
      ))}
    </ul>
  </nav>
  );
}

export default FilterBar;
