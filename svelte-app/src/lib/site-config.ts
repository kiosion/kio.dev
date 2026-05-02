export type SocialLink = { name: string; url: string };

export type SiteConfig = {
  name: string;
  social: SocialLink[];
  pgpKey?: string;
};

export const siteConfig: SiteConfig = {
  name: 'Maxim Dietz',
  social: [
    { name: 'GitHub', url: 'https://github.com/kiosion' },
    { name: 'Email', url: 'mailto:hi@kio.dev' },
  ],
  pgpKey: 'abcdefg',
};
