export const ENV = import.meta.env.MODE;
export const BASE_URL = '/';
export const API_URL = `${BASE_URL}api/`;
export const REMOTE_API_VERSION = 'v1';
export const REMOTE_API_URL =
  import.meta.env.MODE === 'production'
    ? `https://api.kio.dev/${REMOTE_API_VERSION}/`
    : `http://localhost:4000/${REMOTE_API_VERSION}/`;
