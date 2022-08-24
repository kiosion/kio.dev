import express from 'express';
import dotenv from 'dotenv';
import { query } from './lib';
import type { Error, JsonError } from './types';

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
const version = 'v1';
const baseUrl = `/api/${version}`;
const queryUrl = `${baseUrl}/query`;
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

  setHeaders(res);

  if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
    res
      .status(400)
      .send(
        'Invalid limit or skip provided. Limit must be a positive integer, skip must be a non-negative integer.'
      );
    return null;
  }
  if (o !== 'asc' && o !== 'desc') {
    res
      .status(400)
      .send('Invalid order provided. Order must be either "asc" or "desc".');
    return null;
  }
  if (s !== 'date' && s !== 'title') {
    res
      .status(400)
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

const constructError = (
  code: number,
  message: string,
  detail?: string
): string => {
  const res: JsonError = {
    code,
    message
  };
  detail && (res.detail = detail);
  return JSON.stringify(res);
};

const authHandler = (
  req: Request,
  res: Response,
  next: (params?: unknown) => unknown
) => {
  const { authorization } = req.headers;
  setHeaders(res);

  if (!authorization) {
    return res
      .status(401)
      .send(constructError(401, 'Unauthorized', 'No token provided.'));
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .send(constructError(401, 'Unauthorized', 'No token provided.'));
  }
  if (!ACCESS_TOKENS.includes(token)) {
    return res
      .status(401)
      .send(constructError(401, 'Unauthorized', 'Invalid token.'));
  }

  return next();
};

const setHeaders = (res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'max-age=0');
};

app.get(
  `${queryUrl}/posts`,
  authHandler,
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
        setHeaders(res);
        res.json(data);
      })
      .catch((err: Error) => {
        setHeaders(res);
        res
          .status(err?.code ?? 500)
          .send(
            constructError(
              err?.code ?? 500,
              err?.message ?? 'Internal Server Error'
            )
          );
      });
  }
);

app.get(
  `${queryUrl}/post`,
  authHandler,
  async (req: Request, res: Response) => {
    let { slug = '', id = '' } = req.query;
    slug = `${slug}`;
    id = `${id}`;

    query
      .post({ slug, id })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        setHeaders(res);
        res.json(data);
      })
      .catch((err: Error) => {
        setHeaders(res);
        res
          .status(err?.code ?? 500)
          .send(
            constructError(
              err?.code ?? 500,
              err?.message ?? 'Internal Server Error'
            )
          );
      });
  }
);

app.get(`${queryUrl}/projects`, authHandler, async (req, res) => {
  const params = validateQueryParams(req, res);
  if (typeof params !== 'object') {
    return;
  }
  const { limit, skip, s, o, date, tags } = params;

  query
    .projects({ limit, skip, sort: s, order: o }, { date, tags })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      setHeaders(res);
      res.json(data);
    })
    .catch((err: Error) => {
      setHeaders(res);
      res
        .status(err?.code ?? 500)
        .send(
          constructError(
            err?.code ?? 500,
            err?.message ?? 'Internal Server Error'
          )
        );
    });
});

app.get(
  `${queryUrl}/about`,
  authHandler,
  async (req: Request, res: Response) => {
    query
      .about()
      .then((data) => {
        setHeaders(res);
        res.json(data);
      })
      .catch((err: Error) => {
        setHeaders(res);
        res
          .status(err?.code ?? 500)
          .send(
            constructError(
              err?.code ?? 500,
              err?.message ?? 'Internal Server Error'
            )
          );
      });
  }
);

app.get(`${queryUrl}`, authHandler, (req: Request, res: Response) => {
  setHeaders(res);
  res.status(404).send(constructError(404, 'Invalid endpoint'));
});

app.get('/', (req: Request, res: Response) => {
  setHeaders(res);
  res
    .status(418)
    .send(constructError(418, 'Do I look like a coffee machine to you??'));
});

app.get('/(*)', (req: Request, res: Response) => {
  setHeaders(res);
  res.status(403).send(constructError(403, 'Forbidden'));
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
