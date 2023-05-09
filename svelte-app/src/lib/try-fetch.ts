import { browser } from '$app/environment';

/*
 * Since Netlify has a timeout of 10s for any SSR function, we need to wrap
 * all SSR'd fetches in our own timeout block to abort and have the browser
 * handle fetching instead
 *
 * @param promise Promise to wrap
 * @param ms Timeout in milliseconds
 * @returns Initial promise's result
 */
export default <T>(promise: Promise<T>, ms = 6000): Promise<T> => {
  if (browser) {
    console.log('Not in SSR, skipping timeout');
    return promise;
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log('Fetch timed out in SSR');
      return reject(new Error('Fetch timed out in SSR'));
    }, ms);

    return promise
      .then((res) => {
        clearTimeout(timer);
        return resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        return reject(err);
      });
  });
};
