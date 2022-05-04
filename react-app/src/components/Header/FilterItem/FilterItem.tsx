import React from 'react';
import './FilterItem.scss';
const FilterItem: React.FunctionComponent<any> = ({ props }) => {
	const { text } = props;
	return (
		<div className="linkitem">
			<span>{text}</span>
			<div></div>
		</div>
	);
}

export default FilterItem;
