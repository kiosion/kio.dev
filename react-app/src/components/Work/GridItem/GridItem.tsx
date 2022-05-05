import React from 'react';
import { Link } from 'react-router-dom';

import Hover from '../../Hover/Hover';

import './GridItem.scss';
const GridItem: React.FunctionComponent<any> = ({ props }) => {
	const { src, url, title, cat } = props;
  return (
	<div className="workSection__gridItem">
		<Link to={'/project/' + url} >
			<Hover>
				<div className="gridItem__frame">
					<img src={src} alt={title} />
				</div>
			</Hover>
		</Link>
		<div className="gridItem__sub">
			<span className="gridItem__sub-title">{title}</span>
			<Hover>
				<span className="gridItem__sub-cat">#{cat}</span>
			</Hover>
		</div>
	</div>
  );
}

export default GridItem;
