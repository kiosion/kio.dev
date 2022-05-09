import React from 'react';

export const CodeblockComponent = ({ value }: any) => {
	return (
		<div className="contentBody__codeBlock">
			<code>
				{value.code}
			</code>
		</div>
	);
}
