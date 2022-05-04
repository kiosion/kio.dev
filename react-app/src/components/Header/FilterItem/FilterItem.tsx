import React from 'react';
import './FilterItem.scss';
const FilterItem: React.FunctionComponent<any> = ({ props }) => {
	const { text } = props;
	return (
		<div className="app__cursor-link linkitem">
			<span>{text}</span>
			<div></div>
		</div>
	);
}

export default FilterItem;
