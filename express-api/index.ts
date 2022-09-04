import express, { type Request, Response } from 'express';
import dotenv from 'dotenv';
import request from 'request';
import { query, search } from './lib';
import { MODE, PORT, SANITY_API_DATASET } from './lib/env';
import type { Error, JsonError } from './types';

dotenv.config();

const ACCESS_TOKENS = process.env.ACCESS_TOKENS
  ? process.env.ACCESS_TOKENS.split(',')
  : [];

if (ACCESS_TOKENS.length === 0) {
  throw new Error('ACCESS_TOKENS is not defined');
}

const port = PORT;
const version = 'v1';
const baseUrl = `/api/${version}`;
const queryUrl = `${baseUrl}/query`;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

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
  `${queryUrl}/project`,
  authHandler,
  async (req: Request, res: Response) => {
    let { slug = '', id = '' } = req.query;
    slug = `${slug}`;
    id = `${id}`;

    query
      .project({ slug, id })
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

app.get(
  `${queryUrl}/siteSettings`,
  authHandler,
  async (req: Request, res: Response) => {
    query
      .settings()
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

app.get(`${baseUrl}/cdn/*`, (req: Request, res: Response) => {
  const reqUrlParts = req.url?.split('/'),
    resource = reqUrlParts?.[+reqUrlParts?.length - 1]?.split('?')[0],
    params = req.url?.split('?')[1],
    url = `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${SANITY_API_DATASET}/${resource}?${params}`;

  try {
    request(
      {
        url,
        encoding: null
      },
      (err, resp, buffer) => {
        if (!err && resp.statusCode === 200) {
          res.setHeader('Content-Type', resp.headers['content-type']);
          if (params.indexOf('download') > 0) {
            res.setHeader(
              'Content-Disposition',
              `attachment;filename="${resource.substring(
                0,
                resource.lastIndexOf('-')
              )}${resource.substring(
                resource.lastIndexOf('.'),
                resource.length
              )}"`
            );
            res.send(resp.body);
          } else {
            res.send(resp.body);
          }
        } else {
          setHeaders(res);
          res
            .status(404)
            .send(
              constructError(
                404,
                'Not found',
                'Requested resource does not exist or is not accessible'
              )
            );
        }
      }
    );
  } catch (err) {
    setHeaders(res);
    res
      .status(500)
      .send(
        constructError(500, 'Internal server error', 'Failed to fetch resource')
      );
  }
});

app.get(`${baseUrl}/webhooks*`, async (req: Request, res: Response) => {
  setHeaders(res);
  res
    .status(400)
    .send(constructError(400, 'Bad request', `Cannot GET ${req.path}`));
});

app.post(
  `${baseUrl}/webhooks/index/posts`,
  async (req: Request, res: Response) => {
    setHeaders(res);

    const body = req.body;

    if (
      !body?.ids ||
      (!body.ids?.created?.length &&
        !body.ids?.updated?.length &&
        !body.ids?.deleted?.length)
    ) {
      return res
        .status(400)
        .send(
          constructError(
            400,
            'Bad request',
            'Webhook body is invalid or missing fields'
          )
        );
    }
    const status = await search(body);
    return status.status === 200
      ? res
        .status(200)
        .send(
          JSON.stringify({
            code: 200,
            message: 'Success',
            detail: 'Posts indexed'
          })
        )
      : res
        .status(500)
        .send(
          constructError(
            500,
            'Internal server error',
            `Index failed${status.detail !== '' ? ': ' + status.detail : ''}`
          )
        );
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
