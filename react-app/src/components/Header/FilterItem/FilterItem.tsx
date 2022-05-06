import React from 'react';

import Hover from '../../Hover/Hover';

import './FilterItem.scss';
const FilterItem: React.FunctionComponent<any> = ({ props }) => {
	const { text } = props;
	return (
		<Hover>
			<div className="header__filteritem">
				<span>{text}</span>
			</div>
		</Hover>
	);
}

export default FilterItem;
