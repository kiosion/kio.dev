import type { ReturnDocumentsParams } from '../types';

export const returnPosts = ({ req, delay, num }: ReturnDocumentsParams) => {
  let numPosts = num >= 0 ? num : +req.query.limit;
  numPosts = numPosts >= 0 ? numPosts : 10;
  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    posts.push({
      _id: `${i}`,
      _type: 'post',
      date: `${new Date(
        Math.floor(
          Math.random() *
            (new Date('2021-01-01').getTime() -
              new Date('2020-01-01').getTime())
        ) + new Date('2020-01-01').getTime()
      ).toISOString()}`,
      desc: "Something very interesting I'm sure",
      slug: {
        current: `post-${i}`
      },
      title: `Post ${i}`
    });
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: 200,
    body: {
      meta: {
        length: numPosts,
        filter: req.query
      },
      data: posts
    },
    delay
  };
};
