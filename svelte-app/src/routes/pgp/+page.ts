export const load: import('./$types').PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/pgp');
  const response = await res.json();
  return { pgp: response.PGP };
};
