import React, { useEffect, useState } from 'react';
import { client } from '../../../client';
import { PortableText } from '@portabletext/react';
import { Link } from 'react-router-dom';

import { portableTextComponents } from '../../PortableTextComponents';

import Hover from '../../Utils/Hover/Hover';
import PostFooter from './PostFooter/PostFooter';

import './PostSection.scss';
const PostSection: React.FunctionComponent<any> = ({ slug }) => {
    const [post, setPost] = useState<any>([]);
    const [postBody, setPostBody] = useState<any>([]);

    useEffect(() => {
        const query = `*[slug.current == "${slug}"]{
            title,
            slug,
            "author": {
                "name": author->name,
                "bio": author->bio,
                "slug": author->slug.current,
                "image": author->image,
            },
            desc,
            body,
            date,
            "tags": tags[]->{
                title,
                slug,
            },
        }[0]`;
        client
            .fetch(query)
            .then((res) => {
                setPost(res);
                setPostBody(res.body);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
    }, [slug]);

    // Query for current post based on slug, get position in array based on date, and get previous and next post
    const query = `*[_type == "post"]{
        title,
        slug,
        date,
    }`;
    // TODO: Complete this query
    const prevSlug = 'prev';
    const nextSlug = 'next';

    return (
        <div className="app__postSection">
            {post ? (
                <div className="postSection__postContainer">
                    <div className="postContainer__postTags app__no-select">
                        {post.tags ? post.tags.map((tag: any, index: number) => (
                            <Hover key={index}>
                                <Link to={tag.slug.current ? ("/blog/tag/" + tag.slug.current) : ''}>
                                    #{tag.title ? tag.title: 'unknown tag'}
                                </Link>
                            </Hover>
                        )) : (
                            <div>
                                <a href="/blog/">no tags</a>
                            </div>
                        )}
                    </div>
                    <div className="app__section-title">{post.title}</div>
                    <div className="postContainer__postInfo app__no-select">
                        <div className="postInfo__postAuthor">
                            <Hover>
                                <Link to="/about">
                                    <p>{(post.author && post.author.name) ? ('By ' + post.author.name) : 'Unknown'}</p>
                                </Link>
                            </Hover>
                        </div>
                        <div className="postInfo__seperator" />
                        <span className="postInfo__postDate">
                            {post.date && new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <h2 className="postContainer__postDesc">{post.desc}</h2>
                    <div className="postContainer__seperator" />
                    <div className="postContainer__postBody">
                        {postBody ? (
                            <PortableText 
                                value={postBody}
                                components={portableTextComponents}
                            />
                        ) : 'Unable to load post content.'}
                        
                    </div>
                </div>
            ) : (
                <div className="app__sectionLoading">Loading...</div>
            )}
            <div className="app__section-divider"></div>
            <PostFooter 
                prevSlug={prevSlug}
                nextSlug={nextSlug}
                tags={(post && post.tags) ? post.tags : []}
                postAuthor={{
                    name: (post && post.author) && post.author.name,
                    bio: (post && post.author) && post.author.bio,
                    slug: (post && post.author) && post.author.slug, 
                    img: (post && post.author) && post.author.image,
                }}
            />
            <div className="app__section-divider"></div>
        </div>
    );
}

export default PostSection;
