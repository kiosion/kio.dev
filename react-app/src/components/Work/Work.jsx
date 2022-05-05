import React, { useState, useEffect } from 'react';
import { urlFor, client } from "../../client";

import GridItem from './GridItem/GridItem';

import './Work.scss';
const Work = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const query = `*[_type == "portfolioitems" && (visibility)]{
			title,
			slug,
			"image": pimage.asset->url,
			category,
			priority,
		} | order(priority asc)`;
		client
			.fetch(query)
			.then((res) => {
				console.log(res);
				setData(res);
			})
			.catch((err) => {
				console.log('Error: ', err);
			});
	}, []);
	
	return (
		<div className="app__workSection">
			<div className="app__workSection-grid">
				{data.map((item, index) => (
					<GridItem props={{
						src: item.image,
						url: item.slug.current,
						title: item.title,
						cat: item.category
					}} key={item.title+index} />
				))}

				{/* <GridItem props={{ 
					src: '',
					url: '',
					title: 'Placeholder',
					cat: 'design'
					}} /> */}
				
				{/* <GridItem props={{ 
					src: 'https://cdn.kio.dev/portfolio/euphory-1.0.5x.webp', 
					title: 'Euphory 1', 
					cat: 'DESIGN' 
					}} />
				 <GridItem props={{ 
					src: 'https://cdn.kio.dev/portfolio/shattered-i.0.5x.webp', 
					title: 'Shattered I', 
					cat: 'DESIGN' }} />
				<GridItem props={{ 
					src: 'https://cdn.kio.dev/portfolio/shattered-i.0.5x.webp', 
					title: 'Shattered I', 
					cat: 'DESIGN' }} /> */}
			</div>
		</div>
  	);
}

export default Work;
