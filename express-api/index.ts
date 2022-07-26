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
  new BearerStrategy((token: string, done: any) => {
    return ACCESS_TOKENS.includes(token) ? done(null, token) : done(null, false);
  })
);

app.get(
  '/v1/query/posts',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
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
      .then((data: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        res.json(data);
      })
      .catch((err: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        res.status(500).send(err);
      });
  }
);

// TODO: Add routes

// Routes for:

// - fetching all projects (count)
// - fetching range of projects (x to y)
// - fetching project by slug or id

app.get('/(*)', (req, res) => {
  res.status(403).send('<center><h2>⛔ Go away! Nothing to see here</h2></center>');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
