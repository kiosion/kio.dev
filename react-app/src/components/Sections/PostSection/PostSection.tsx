import React, { useEffect, useState } from 'react';
import { client } from '../../../client';
import { PortableText, toPlainText, PortableTextComponents } from '@portabletext/react';
import slugify from 'slugify';
import { Link } from 'react-router-dom';

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
                "image": author->image.asset->url,
            },
            desc,
            body,
            date,
            tags,
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

    const stringToSlug = (value: any) => {
        return slugify(toPlainText(value))
            .toLowerCase();
    }

    const portableTextComponents: PortableTextComponents = {
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
                return (
                    <div className="postBody__codeBlock">
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
    }

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
                            <Hover>
                                #{tag}
                            </Hover>
                        )) : 'No tags'}
                    </div>
                    <h1 className="postContainer__postTitle">{post.title}</h1>
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
                <div>404</div>
            )}
            <div className="app__section-divider"></div>
            <PostFooter 
                prevSlug={prevSlug}
                nextSlug={nextSlug}
                tags={post.tags}
                postAuthor={{
                    name: post.author && post.author.name,
                    bio: post.author && post.author.bio,
                    slug: post.author && post.author.slug, 
                    img: post.author && post.author.image,
                }}
            />
            <div className="app__section-divider"></div>
        </div>
    );
}

export default PostSection;
