import React, { useEffect, useState } from 'react';
import { urlFor } from '../../../../client';
import { Link } from 'react-router-dom';

import Hover from '../../../Utils/Hover/Hover';

import './PostFooter.scss';

type PostAuthor = {
    name: string;
    bio: string;
    slug: string;
    img: string | undefined;
}

const PostFooter: React.FunctionComponent<any> = (
  props: { 
        prevSlug: string,
        nextSlug: string,
        tags: string [],
        authorName: string,
        postAuthor: {
            name: string,
            bio: string,
            slug: string,
            img: string
        }
    }) => {

  const [prevSlug, setPrevSlug] = useState<string>();
  const [nextSlug, setNextSlug] = useState<string>();
  const [tags, setTags] = useState<string []>([]);
  const [author, setAuthor] = useState<PostAuthor>();

  useEffect(() => {
    setPrevSlug(props.prevSlug);
    setNextSlug(props.nextSlug);
    setTags(props.tags);
    setAuthor({ name: props.postAuthor.name, bio: props.postAuthor.bio, slug: props.postAuthor.slug, img: props.postAuthor.img });
  }, [props.prevSlug, props.nextSlug, props.tags, props.postAuthor.name, props.postAuthor.bio, props.postAuthor.slug, props.postAuthor.img]);

  return (
    <div className="postContainer__postFooter">
      <div className="postFooter__postInfo">
        <div className="postFooter__postInfo-tags app__no-select">
          {tags ? tags.map((tag: any, index: number) => (
            <Hover key={index}>
              <Link to={tag.slug.current ? ('/blog/tag/' + tag.slug.current) : '/blog'}>
                                #{tag.title ? tag.title : 'unknown tag'}
              </Link>
            </Hover>
          )): (
            <div>
              <a href="/blog/">no tags</a>
            </div>
          )}
        </div>
        <div className="postFooter__postInfo-author">
          <div className="postInfo-author__img app__no-select">
            <Hover>
              <Link to={'/about'}>
                {(author && author.img) && (
                  <img src={urlFor(author.img).width(100).height(100).url()} alt={author.name + 'profile image'} />
                )}
              </Link>
            </Hover>
          </div>
          <div className="postInfo-author__text">
            <p>{(author && author.name) ? ('By ' + author.name) : 'Unable to load post author.'}</p>
            <p>{(author && author.bio) ? author.bio : 'Unable to load bio.'}</p>
          </div>
        </div>
      </div>
      <div className="postFooter__navButtons app__no-select">
        <Hover className="postFooter__prevLink">
          <Link to={'/blog/' + prevSlug}>
                        &lt; previous post
          </Link>
        </Hover>
        <Hover className="postFooter__nextLink">
          <Link to={'/blog/' + nextSlug}>
                        next post &gt;
          </Link>
        </Hover>
      </div>
    </div>
  );
};

export default PostFooter;
