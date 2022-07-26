import express from 'express';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import dotenv from 'dotenv';
import { query } from './lib';

dotenv.config();

const ACCESS_TOKENS = process.env.ACCESS_TOKENS ? process.env.ACCESS_TOKENS.split(',') : [];

if (ACCESS_TOKENS.length === 0) {
  throw new Error('ACCESS_TOKENS is not defined');
}

const port = 4000;
const app = express();

passport.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new BearerStrategy((token: string, done: any) => {
    console.log('new request with token: ', token);
    return ACCESS_TOKENS.includes(token) ? done(null, token) : done(null, false);
  })
);

app.get(
  '/v1/query/posts',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    // console.log('new request: ', req);
    let { limit = 10, skip = 0, s = 'date', o = 'desc', date = '', tags = '' } = req.query;
    limit = parseInt(`${limit}`);
    skip = parseInt(`${skip}`);
    s = `${s}`;
    o = `${o}`;
    date = `${date}`;
    tags = `${tags}`.split(',');
    if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
      return res
        .status(401)
        .send(
          'Invalid limit or skip provided. Limit must be a positive integer, skip must be a non-negative integer.'
        );
    }
    if (o !== 'asc' && o !== 'desc') {
      return res.status(401).send('Invalid order provided. Order must be either "asc" or "desc".');
    }
    if (s !== 'date' && s !== 'title') {
      return res.status(401).send('Invalid sort provided. Sort must be either "date" or "title".');
    }

    query
      .posts({ limit, skip, sort: s, order: o }, { date, tags })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        res.json(data);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        res.status(500).send(err);
      });
  }
);

app.get('/v1/query/post', passport.authenticate('bearer', { session: false }), async (req, res) => {
  let { slug = '', id = '' } = req.query;
  slug = `${slug}`;
  id = `${id}`;

  query
    .post({ slug, id })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      res.json(data);
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any) => {
      res.status(500).send(err);
    });
});

// TODO: Add routes

// - fetching all projects (count)
// - fetching range of projects (x to y)
// - fetching project by slug or id

app.get('/(*)', (req, res) => {
  console.log('new request: ', req.headers);
  console.log('bearer token: ', req.headers.authorization);
  console.log(
    'bearer valid? ',
    ACCESS_TOKENS.includes(req.headers.authorization?.split('Bearer ')?.[1])
  );
  res.status(403).send('<center><h2>⛔ Go away! Nothing to see here</h2></center>');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
