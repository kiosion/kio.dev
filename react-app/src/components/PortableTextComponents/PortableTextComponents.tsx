import React from 'react';
import { toPlainText, PortableTextComponents } from '@portabletext/react';
import slugify from 'slugify';

import { CodeblockComponent, ImageComponent } from '../SanityComponents';

import Hover from '../Utils/Hover/Hover';

const stringToSlug = (value: any) => {
	return slugify(toPlainText(value))
		.toLowerCase();
}

export const portableTextComponents: PortableTextComponents = {
	marks: {
		link: ({ children, value }) => {
			const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
			return (
				<Hover>
					<p className="app__ul-selector">
						<a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : ''}>
							{children}
						</a>
					</p>
				</Hover>
			);
		},
		code: ({ children, value }) => {
			// If code is inline and not of a 'code' type
			return (
				<div className="contentBody__codeInline">
					<code>
						{children}
					</code>
				</div>
			);
		},
	},
	block: {
		h1: ({ children, value }) => {
			return ( <h1 id={stringToSlug(value)}>{children}</h1> );
		},
		h2: ({ children, value }) => {
			return ( <h2 id={stringToSlug(value)}>{children}</h2> );
		},
		h3: ({ children, value }) => {
			return ( <h3 id={stringToSlug(value)}>{children}</h3> );
		},
		h4: ({ children, value }) => {
			return ( <h4 id={stringToSlug(value)}>{children}</h4> );
		},
	},
	types: {
		image: ImageComponent,
		code: CodeblockComponent,
	}
};
