import express from 'express';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import dotenv from 'dotenv';
import { query } from './lib';

// eslint-disable-next-line no-duplicate-imports
import type { Request, Response } from 'express';

dotenv.config();

const ACCESS_TOKENS = process.env.ACCESS_TOKENS
  ? process.env.ACCESS_TOKENS.split(',')
  : [];

if (ACCESS_TOKENS.length === 0) {
  throw new Error('ACCESS_TOKENS is not defined');
}

const port = 4000;
const app = express();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateQueryParams = (req: Request, res: Response): any | null => {
  let {
    limit = 10,
    skip = 0,
    s = 'date',
    o = 'desc',
    date = '',
    tags = ''
  } = req.query;

  limit = parseInt(`${limit}`);
  skip = parseInt(`${skip}`);
  s = `${s}`;
  o = `${o}`;
  date = `${date}`;
  tags = `${tags}`.split(',');

  if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
    res
      .status(401)
      .send(
        'Invalid limit or skip provided. Limit must be a positive integer, skip must be a non-negative integer.'
      );
    return null;
  }
  if (o !== 'asc' && o !== 'desc') {
    res
      .status(401)
      .send('Invalid order provided. Order must be either "asc" or "desc".');
    return null;
  }
  if (s !== 'date' && s !== 'title') {
    res
      .status(401)
      .send('Invalid sort provided. Sort must be either "date" or "title".');
    return null;
  }

  return {
    limit,
    skip,
    s,
    o,
    date,
    tags
  };
};

passport.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new BearerStrategy((token: string, done: any) => {
    return ACCESS_TOKENS.includes(token)
      ? done(null, token)
      : done(null, false);
  })
);

app.get(
  '/v1/query/posts',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    const params = validateQueryParams(req, res);
    if (typeof params !== 'object') {
      return;
    }
    const { limit, skip, s, o, date, tags } = params;

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

app.get(
  '/v1/query/post',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    let { slug = '', id = '' } = req.query;
    slug = `${slug}`;
    id = `${id}`;

    query
      .post({ slug, id })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        res.json(data);
      })
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  }
);

app.get(
  '/v1/query/projects',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    const params = validateQueryParams(req, res);
    if (typeof params !== 'object') {
      return;
    }
    const { limit, skip, s, o, date, tags } = params;

    query
      .projects({ limit, skip, sort: s, order: o }, { date, tags })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        res.json(data);
      })
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  }
);

app.get(
  '/v1/query/about',
  passport.authenticate('bearer', { session: false }),
  async (req: Request, res: Response) => {
    query
      .about()
      .then((data) => {
        res.json(data);
      })
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  }
);

app.get('/(*)', (req: Request, res: Response) => {
  res
    .status(403)
    .send('{ error: 403, status: "Go away! Nothing to see here" }');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
