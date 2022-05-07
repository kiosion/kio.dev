import React, { useEffect, useState } from 'react';
import { client } from '../client';

import { Header, Footer, Posts } from '../components';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const query = `*[_type == "post"]`;

        client
            .fetch(query)
            .then((res) => {
                setPosts(res);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
        }, []);
    return (
        <div className="app">
            <Header view={"blog"} route={["", "home"]} />
            <Posts />
            <Footer view={"relative"} />
        </div>
    );
}

export default Blog;
