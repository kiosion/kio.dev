import { defineCliConfig } from 'sanity/cli';
import dotenv from 'dotenv';
dotenv.config();

export default defineCliConfig({
  api: {
    projectId: 'gkgnfulv',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  }
});
