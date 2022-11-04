import Robots from '$lib/fixtures/robots';
import PGP from '$lib/fixtures/pgp';

export const GET: import('./$types').RequestHandler = async ({
  url
  // eslint-disable-next-line @typescript-eslint/require-await
}): Promise<Response> => {
  const filename = url.pathname.split('/').pop();

  switch (filename) {
    case 'robots.txt':
      return new Response(Robots, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8'
        }
      });
    case 'pgp.txt':
      return new Response(PGP, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8'
        }
      });
    default:
      return new Response(
        JSON.stringify({
          status: 404,
          message: 'Not found'
        }),
        {
          headers: {
            'content-type': 'application/json',
            charset: 'utf-8'
          }
        }
      );
  }
};
