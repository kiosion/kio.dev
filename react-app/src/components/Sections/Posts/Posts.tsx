import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hover from '../../Utils/Hover/Hover';
import { client } from '../../../client';

import './Posts.scss';
const Posts = () => {
  const resultsPerPage = 2;

  const [posts, setPosts] = useState<any>([]);
  const [results, setResults] = useState<number>((resultsPerPage - 1));

  useEffect(() => {
    const query = `*[!(_id in path('drafts.**')) && _type == "post"]{
        title,
        slug,
        "author": {
            "name": author->name,
            "slug": author->slug.current,
        },
        desc,
        date,
        "tags": tags[]->{
            title,
            slug,
        },
    } | order(date desc) [0..${results}]`;

    client
      .fetch(query)
      .then((res) => {
        setPosts(res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }, [results]);

  const error = () => {
    throw new Error('Something went wrong!');
  };

  return (
    <div className="app__postList">
      <div className="app__section-title">Blog</div>
      {posts ? (posts.map((item: any, index: any) => (
        <div className="postList__cardItem" key={index}>
          <h3 className="cardItem__title">{item.title}</h3>
          <div className="cardItem__cardInfo">
            <span className="cardInfo__author">
              {item.author.name ? item.author.name : 'Unknown Author'}
            </span>
            <div className="cardInfo__seperator" />
            <span className="cardInfo__date">
              {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'Unknown Date'}
            </span>
            <div className="cardInfo__seperator" />
            <span className="cardInfo__tags app__no-select">
              {item.tags ? item.tags.map((tag: any, index: number) => (
                <Hover key={index}>
                  <Link to={tag.slug.current ? ('/blog/tag/' + tag.slug.current) : '/blog/'}>
                                        #{tag.title ? tag.title : 'unknown tag'}
                  </Link>
                </Hover>
              )) : (
                <div>
                  <a href="/blog/">
                                        no tags
                  </a>
                </div>
              )}
            </span>
          </div>
                    
          <p className="cardItem__desc">{item.desc}</p>
          <Hover
            className="cardItem__readMore"
          >
            <Link to={`/blog/p/${item.slug.current}`}>
                            Read more
            </Link>
          </Hover>
        </div>
      ))
      ) : (
        <div className="app__sectionLoading">Loading...</div>
      )}
      {posts ? (
        <div className="postList__loadMore">
          <Hover>
            <div 
              className="loadMore__button"
              onClick={() => {
                setResults(results + resultsPerPage);
              }}
            >
                            Load more
            </div>
          </Hover>
        </div>
      ) : (
        <div className="app__sectionLoading">Loading...</div>
      )}
    </div>
  );
};

export default Posts;
