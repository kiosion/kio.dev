import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hover from '../../Utils/Hover/Hover';
import { client } from '../../../client';

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

  return (
    <div className="app__cardList">
      <div className="app__section-title">Blog</div>
      <div className="app__cardList-container">
        {posts ? (posts.map((item: any, index: any) => (
          <div className="cardList__cardItem" key={index}>
            <div className="cardItem__col">
              <div className="cardItem__index">{index + 1}</div>
              <Hover
                className="cardItem__readMore"
              >
                <Link to={`/blog/p/${item.slug.current}`}>Read</Link>
              </Hover>
            </div>
            <div className="cardItem__col">
              <div className="cardItem__title"><div className="cardItem__title-text"><span>{item.title}</span></div></div>
              <div className="cardItem__cardInfo">
                <span className="cardInfo__date">
                  {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'Unknown Date'}
                </span>
                {item.tags.length > 0 ? <div className="cardInfo__seperator" /> : ''}
                <span className="cardInfo__tags app__no-select">
                  {item.tags ? item.tags.map((tag: any, index: number) => (
                    <Hover key={index}>
                      <Link to={tag.slug.current ? ('/blog/tag/' + tag.slug.current) : '/blog/'}>#{tag.title ? tag.title : 'unknown tag'}</Link>
                    </Hover>
                  )) : (
                    <div>
                      <a href="/blog/">no tags</a>
                    </div>
                  )}
                </span>
              </div>
              <p className="cardItem__desc">{item.desc}</p>
            </div>
          </div>
        ))
        ) : (
          <div className="app__sectionLoading">Loading...</div>
        )}
        {posts ? (
          <div className="cardList__loadMore">
            <Hover>
              <div 
                className="loadMore-button"
                onClick={() => {
                  setResults(results + resultsPerPage);
                }}
              >Load more</div>
            </Hover>
          </div>
        ) : (
          <div className="app__sectionLoading">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
