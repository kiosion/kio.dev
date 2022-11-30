import { defineConfig, SanityDocumentLike } from 'sanity';
import { studioTheme } from '@sanity/ui';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas/schema';
import { structure } from './structure';
import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { BrandLogo } from './components/BrandLogo';

// @ts-expect-error
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'kio.dev',
  projectId: 'gkgnfulv',
  dataset,
  plugins: [
    deskTool({
      structure
    }),
    visionTool({
      defaultApiVersion: 'v2022-11-29'
    }),
    codeInput()
  ],
  logo: BrandLogo,
  navbar: {
    components: {
      logo: BrandLogo
    }
  },
  theme: {
    ...studioTheme
  },
  schema: {
    types: schemaTypes
  },
  document: {
    productionUrl: async (prev, context) => {
      const { dataset, document } = context,
        { slug } = document as SanityDocumentLike & {
          slug: { current: string };
        },
        baseUrl =
          dataset === 'production'
            ? 'https://kio.dev'
            : 'https://stage.kio.dev';
      if (!slug?.current) {
        return prev;
      }
      switch (document._type) {
        case 'post':
          return `${baseUrl}/blog/${slug.current}`;
        case 'project':
          return `${baseUrl}/work/${slug.current}`;
        case 'author':
          return `${baseUrl}/about`;
      }
      return prev;
    }
  }
});
