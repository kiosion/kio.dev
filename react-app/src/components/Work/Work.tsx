import React, { useState, useEffect } from 'react';
import { client } from "../../client";

import Carousel from './Carousel/Carousel';

import './Work.scss';
const Work = () => {
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		const query = `*[_type == "item" && (visibility)]{
			title,
			slug,
			"image": pimage.asset->url,
			category,
			priority,
		} | order(priority asc)`;
		client
			.fetch(query)
			.then((res) => {
				setData(res);
			})
			.catch((err) => {
				console.log('Error: ', err);
			});
	}, []);
	
	return (
		<div className="app__workSection">
			<div className="workSection__carousel-container">
				<Carousel itemData={ data } />
			</div>
		</div>
  	);
}

export default Work;
