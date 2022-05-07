import React, { useEffect, useState } from 'react';
import { client } from '../../../client';
import { PortableText, toPlainText, PortableTextComponents } from '@portabletext/react';
import slugify from 'slugify';

import Hover from '../../Utils/Hover/Hover';

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
                "slug": author->slug.current,
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
                //console.log(res.body);
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
                    <div className="postBody__codeBlock"><code>{children}</code></div>
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

    return (
        <div className="app__postSection">
            {post ? (
                <div className="postSection__postContainer">
                    <div className="postContainer__postTags app__no-select">
                        {post.tags ? post.tags.map((tag: any, index: number) => (
                            <Hover>
                                #{tag}
                            </Hover>
                        )) : ''}
                    </div>
                    <h1 className="postContainer__postTitle">{post.title}</h1>
                    <div className="postContainer__postInfo app__no-select">
                        <span className="postInfo__postAuthor">
                            By {post.author ? post.author.name : 'Unknown'}
                        </span>
                        <div className="postInfo__seperator" />
                        <span className="postInfo__postDate">
                            {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }) : 'Unknown'}
                        </span>
                    </div>
                    <h2 className="postContainer__postDesc">{post.desc}</h2>
                    <div className="postContainer__seperator" />
                    <div className="postContainer__postBody">
                        <PortableText 
                            value={postBody}
                            components={portableTextComponents}
                        />
                    </div>
                </div>
            ) : (
                <div>404</div>
            )}
            <div className="app__section-divider"></div>
        </div>
    );
}

export default PostSection;
