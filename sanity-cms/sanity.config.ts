import { Config, defineConfig, SanityDocumentLike } from 'sanity';
import { buildTheme } from '@sanity/ui/theme';
import { schemaTypes } from '$schema/schema';
import { structure } from '$/structure';
import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';

const dataset =
  (import.meta as { env?: Record<string, string> }).env
    ?.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'kio.dev',
  projectId: 'gkgnfulv',
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({
      defaultApiVersion: 'v2022-11-29'
    }),
    codeInput()
  ],
  theme: buildTheme(),
  schema: {
    types: schemaTypes
  },
  document: {
    productionUrl: async (prev, context) => {
      const { dataset, document } = context,
        { slug } = document as SanityDocumentLike & {
          slug: { current: string };
        },
        baseUrl = 'https://kio.dev';
      if (!slug?.current) {
        return prev;
      }
      switch (document._type) {
        case 'post':
          return `${baseUrl}/thoughts/${slug.current}`;
      }
      return prev;
    }
  }
} satisfies Config);
