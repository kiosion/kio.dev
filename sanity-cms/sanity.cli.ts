import { defineCliConfig } from 'sanity/cli';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineCliConfig({
  api: {
    projectId: 'gkgnfulv',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  vite: {
    resolve: {
      alias: {
        $schema: path.resolve(__dirname, './schemas'),
        $fields: path.resolve(__dirname, './schemas/fields'),
        $objects: path.resolve(__dirname, './schemas/objects'),
        $renderers: path.resolve(__dirname, './schemas/renderers'),
        $components: path.resolve(__dirname, './components'),
        $: path.resolve(__dirname, './')
      }
    }
  },
  typegen: {
    path: '../svelte-app/src/lib/sanity.queries.server.ts',
    schema: './schema.json',
    generates: '../svelte-app/types/generated/sanity.types.ts',
    formatGeneratedCode: true,
    overloadClientMethods: true
  },
});
