import React from 'react';
import './HeaderBlock.scss';
const AboutBlock = ({ props }) => {
	const { title, body } = props;
	return (
	<div className="block app__no-select">
		<div className="h-container">
			<h3 className="h-text">{title}</h3>
			<div />
		</div>
		<p className="p-text">{body}</p>
	</div>
	);
}

export default AboutBlock;
