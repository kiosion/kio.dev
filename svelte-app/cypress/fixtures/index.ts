import type { ReturnDocumentsParams } from '../types';

const fakePostData = (i = 1) => ({
  _id: `${i}`,
  _type: 'post',
  date: `${new Date(
    Math.floor(
      Math.random() *
        (new Date('2021-01-01').getTime() - new Date('2020-01-01').getTime())
    ) + new Date('2020-01-01').getTime()
  ).toISOString()}`,
  desc: "Something very interesting I'm sure",
  slug: {
    current: `post-${i}`
  },
  title: `Post ${i}`
});

const returnPosts = ({ req, delay, num }: ReturnDocumentsParams) => {
  let numPosts = num >= 0 ? num : +req.query.limit;
  numPosts = numPosts >= 0 ? numPosts : 10;
  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    posts.push(fakePostData(i));
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: 200,
    body: {
      meta: {
        total: numPosts,
        count: numPosts,
        filter: req.query
      },
      data: posts ? posts : [{}]
    },
    delay
  };
};

const returnPost = ({
  req,
  delay,
  empty = false
}: Omit<ReturnDocumentsParams, 'num'> & { empty?: boolean }) => {
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: empty ? 500 : 200,
    body: empty
      ? {
          status: 500,
          error: 'Requested resource could not be found'
        }
      : {
          meta: {
            total: 1,
            count: 1,
            filter: req.query
          },
          data: fakePostData()
        },
    delay
  };
};

export { returnPost, returnPosts };
