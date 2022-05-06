import React, { useEffect, useState } from 'react';
import { client } from '../../client';

import './PostSection.scss';
const PostSection: React.FunctionComponent<any> = ({ slug }) => {
	const [post, setPost] = useState<any>([]);
	const [postBody, setPostBody] = useState<any>([]);

	useEffect(() => {
		const query = `*[slug.current == "${slug}"]{
			title,
			slug,
			desc,
			body,
		}[0]`;
		client
			.fetch(query)
			.then((res) => {
				setPost(res);
				console.log('res: ', res);
				setPostBody(res.body);
				console.log('res body: ', res.body);
			})
			.catch((err) => {
				console.log('Error: ', err);
			});
	}, [slug]);

	return (
		<div>
			{post ? (
				<div>
					<h3>{post.title}</h3>
					<br />
					<h4>{post.desc}</h4>
					<br />
					{postBody.map((item: any, index: number) => (
						console.log('item: ', item),
						<div key={index}>
							{item._type === 'block' && (
								<p>
									{item.children[0].text}
								</p>
							)
							}
						</div>
					))}

				</div>
			) : (
				<div>404</div>
			)}
		</div>
	);
}

export default PostSection;
