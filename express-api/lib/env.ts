import dotenv from 'dotenv';

dotenv.config();

export const MODE = process.env.MODE;
export const PORT = MODE === 'dev' ? 4444 : 4000;
export const ALGOLIA_INDEX = MODE === 'dev' ? 'dev_kio.dev' : 'prod_kio.dev';
export const SANITY_API_DATASET = MODE === 'dev' ? 'dev' : 'production';
