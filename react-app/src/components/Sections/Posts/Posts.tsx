import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hover from '../../Utils/Hover/Hover';
import { client } from '../../../client';

import './Posts.scss';
const Posts = () => {
    const [posts, setPosts] = useState<any>([]);
    const [postHover, setPostHover] = useState(null);

    useEffect(() => {
        const query = `*[_type == "post"]{
            title,
            slug,
            "author": {
                "name": author->name,
                "slug": author->slug.current,
            },
            desc,
            date,
            tags,
        } | order(date desc)`;

        client
            .fetch(query)
            .then((res) => {
                setPosts(res);
                console.log(res);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
    }, []);

    return (
        <div className="app__postList">
            <div className="app__postList-title">All posts</div>
            {posts.map((item: any, index: any) => (
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
                                <Hover>
                                    #{tag}
                                </Hover>
                            )) : ''}
                        </span>
                    </div>
                    
                    <p className="cardItem__desc">{item.desc}</p>
                    <Hover
                        className="cardItem__readMore"
                    >
                        <Link to={`/blog/${item.slug.current}`}>
                            Read more
                        </Link>
                    </Hover>
                </div>
            ))}
        </div>
    );
}

export default Posts;
