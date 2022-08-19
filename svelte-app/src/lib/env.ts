export const ENV = import.meta.env.MODE;
export const BASE_URL = '/';
export const API_URL = `${BASE_URL}api/`;
export const REMOTE_API_VERSION = 'v1';
export const REMOTE_API_URL =
  import.meta.env.MODE === 'production' || import.meta.env.MODE === 'backed'
    ? `https://kio.sh/api/${REMOTE_API_VERSION}/`
    : `http://localhost:4000/api/${REMOTE_API_VERSION}/`;
export const REMOTE_API_TOKEN = import.meta.env.VITE_API_TOKEN;
