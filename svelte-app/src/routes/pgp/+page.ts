export const load: import('./$types').PageLoad = async ({ fetch }) => {
  // const now = performance.now();
  const res = await fetch('/api/pgp');
  const response = await res.json();
  // const delta = performance.now() - now;
  // delta < 200 &&
  //   (await new Promise((resolve) => setTimeout(resolve, 200 - delta)));
  return { pgp: response.data };
};
