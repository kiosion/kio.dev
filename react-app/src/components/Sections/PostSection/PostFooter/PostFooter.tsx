import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Hover from '../../../Utils/Hover/Hover';

import './PostFooter.scss';
const PostFooter: React.FunctionComponent<any> = (props: { prevSlug: string, nextSlug: string }) => {
    const [prevSlug, setPrevSlug] = useState<string>('');
    const [nextSlug, setNextSlug] = useState<string>('');

    useEffect(() => {
        setPrevSlug(props.prevSlug);
        setNextSlug(props.nextSlug);
    }, [props.prevSlug, props.nextSlug]);

    return (
        <div className="postContainer__postFooter">
            <Hover className="postFooter__prevLink">
                <Link to="/blog">
                    &lt; previous post
                </Link>
            </Hover>
            <Hover className="postFooter__nextLink">
                <Link to="/blog">
                    next post &gt;
                </Link>
            </Hover>
        </div>
    );
}

export default PostFooter;
