import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'File Protector',
  tagline: 'Module noyau Linux de protection avancée de fichiers par chiffrement AES-256',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sos-c-mml', // Usually your GitHub org/user name.
  projectName: 'file-protector', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'File Protector',
      logo: {
        alt: 'File Protector Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml',
          label: 'GitLab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Installation',
              to: '/docs/installation',
            },
            {
              label: 'Utilisation',
              to: '/docs/usage',
            },
          ],
        },
        {
          title: 'Ressources',
          items: [
            {
              label: 'Wiki GitLab',
              href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/home',
            },
            {
              label: 'Architecture',
              href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml/-/blob/main/docs/ARCHITECTURE.md',
            },
            {
              label: 'Code source',
              href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml/-/tree/main/fprotect',
            },
          ],
        },
        {
          title: 'Projet',
          items: [
            {
              label: 'GitLab',
              href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml',
            },
            {
              label: 'Issues',
              href: 'https://git.oteria.fr/sos-c-mml/sos-c-mml/-/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SOS-C-MML. Projet académique sous licence GPL v2.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'c', 'ini', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
