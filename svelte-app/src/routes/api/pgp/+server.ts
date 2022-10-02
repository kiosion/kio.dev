import PGP from '$lib/fixtures/pgp';

// Temp endpoint with hardcoded data, will move to API later
export const GET: import('./$types').RequestHandler =
  async (): Promise<Response> => {
    return new Response(JSON.stringify({ PGP }), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  };
