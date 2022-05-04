import React from 'react';

import './GridItem.scss';
const GridItem: React.FunctionComponent<any> = ({ props }) => {
	const { src, title, cat } = props;
  return (
	<div className="workSection__gridItem">
		<div className="gridItem__frame">
			<img src={src} alt={title} />
		</div>
		<div className="gridItem__sub">
			<span className="gridItem__sub-title">{title}</span>
			<span className="gridItem__sub-cat">#{cat}</span>
		</div>
	</div>
  );
}

export default GridItem;
