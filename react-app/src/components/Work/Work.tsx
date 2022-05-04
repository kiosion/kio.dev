//import React, { useState, useEffect } from 'react';
//import sanityClient from "../../sanityClient";
import React from 'react';

import GridItem from './GridItem/GridItem';

import './Work.scss';
const Work = () => {
  
	
	
	return (
		<div className="app__workSection">
			<div className="app__workSection-grid">
				{/* Very temp, will put in a for loop later lol */}
				<GridItem props={{ 
					src: 'https://cdn.kio.dev/portfolio/infinitys-edge-ii.0.5x.webp', 
					title: 'Infinity\'s Edge II', 
					cat: 'ART' 
					}} />
				<GridItem props={{ src: '', title: 'Placeholder', cat: 'DESIGN' }} />
			</div>
		</div>
  	);
}

export default Work;
