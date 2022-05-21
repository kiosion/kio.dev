import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PostSection } from '../components';

const Post = () => {
  const { slug } = useParams();
  return (
    <div className="app__content">
      {/* TODO: Fetch blog post content here, pass down to components in order to use metadata for SEO */}
      <Helmet>
        <title>kio.dev / {slug}</title>
      </Helmet>
      <PostSection slug={ slug } />
    </div>
  );
};

export default Post;
