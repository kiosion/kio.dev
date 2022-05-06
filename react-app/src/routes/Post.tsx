import React from 'react';
import { useParams } from 'react-router-dom';

import { Header, Footer, PostSection } from '../components';

const Post = () => {
	const { slug } = useParams();

	return (
		<div className="app">
			<Header view={"blog"} route={"blog"} />
			<PostSection slug={ slug } />
			<Footer />
		</div>
	);
}

export default Post;
