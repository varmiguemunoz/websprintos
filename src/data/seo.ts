export const SITE = {
  url:         'https://sprintos.dev',
  name:        'SprintOS',
  title:       'SprintOS — The Developer Operating System',
  description: 'The terminal-first project manager for developer teams. Manage sprints, track time, and automate workflows from your terminal. AI-native, GitHub-connected, MCP ready.',
  keywords:    'terminal project manager, CLI task management, developer productivity, TUI kanban, sprint planning CLI, MCP project management, go terminal app, keyboard-driven project manager',
  locale:      'en_US',
  twitterHandle: '@varmiguemunoz',
  author: {
    name:  'Miguel Angel Jaramillo Muñoz',
    email: 'varmiguemunoz@gmail.com',
    url:   'https://github.com/varmiguemunoz',
    github:'https://github.com/varmiguemunoz',
  },
  ogImage:     'https://sprintos.dev/og.png',
  logo:        'https://sprintos.dev/logo.png',
  github:      'https://github.com/varmiguemunoz/sprintos',
  version:     '2.4',
};

export const categoryLabels: Record<string, string> = {
  'dev-tips':       'Dev Tips',
  'automation':     'Automation',
  'ai-tools':       'AI Tools',
  'agency-workflow':'Agency Workflow',
  'tech-stack':     'Tech Stack',
  'others':         'Others',
};

export function schemaOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       SITE.name,
    url:        SITE.url,
    logo: {
      '@type': 'ImageObject',
      url:     SITE.logo,
      width:   '512',
      height:  '512',
    },
    email:        SITE.author.email,
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name:    SITE.author.name,
      url:     SITE.author.url,
    },
    sameAs: [SITE.github],
  };
}

export function schemaWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    name:       SITE.name,
    url:        SITE.url,
    description: SITE.description,
    potentialAction: {
      '@type':       'SearchAction',
      target:        `${SITE.url}/blog?category={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function schemaSoftwareApplication() {
  return {
    '@context':           'https://schema.org',
    '@type':              'SoftwareApplication',
    name:                 SITE.name,
    applicationCategory:  'DeveloperApplication',
    operatingSystem:      'macOS, Linux, Windows',
    description:          SITE.description,
    url:                  SITE.url,
    downloadUrl:          SITE.github,
    softwareVersion:      SITE.version,
    releaseNotes:         `${SITE.github}/releases`,
    license:              'https://opensource.org/licenses/MIT',
    isAccessibleForFree:  true,
    offers: {
      '@type':        'Offer',
      price:          '0',
      priceCurrency:  'USD',
      description:    'Free and open source. One-time $5 Supporter tier available.',
    },
    author: {
      '@type': 'Person',
      name:    SITE.author.name,
      url:     SITE.author.url,
    },
    screenshot: SITE.ogImage,
    featureList: [
      'Terminal-native kanban board',
      'Sprint planning and velocity tracking',
      'Built-in time tracking and Pomodoro',
      'GitHub two-way sync',
      'MCP server for AI agents (Claude, Cursor, Windsurf)',
      'REST API with OpenAPI docs',
      'PDF executive reports',
      'macOS menu bar app',
      'Self-hosted via PostgreSQL',
    ],
  };
}

export function schemaBlogPosting(post: {
  title:       string;
  description: string;
  slug:        string;
  pubDate:     Date;
  updatedDate?: Date;
  image?:      string;
  category:    string;
  tags?:       string[];
  authors?:    string[];
}) {
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    '@context':      'https://schema.org',
    '@type':         'BlogPosting',
    headline:        post.title,
    description:     post.description,
    url,
    datePublished:   post.pubDate.toISOString(),
    dateModified:    (post.updatedDate ?? post.pubDate).toISOString(),
    image: post.image ?? SITE.ogImage,
    keywords:        post.tags?.join(', ') ?? categoryLabels[post.category] ?? post.category,
    articleSection:  categoryLabels[post.category] ?? post.category,
    inLanguage:      'en-US',
    author: {
      '@type': 'Person',
      name:    SITE.author.name,
      url:     SITE.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name:    SITE.name,
      logo: {
        '@type': 'ImageObject',
        url:     SITE.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   url,
    },
  };
}

export function schemaBlogCollectionPage(pageNum: number) {
  return {
    '@context':   'https://schema.org',
    '@type':      'CollectionPage',
    name:         `SprintOS Blog${pageNum > 1 ? ` — Page ${pageNum}` : ''}`,
    description:  'Technical deep-dives on terminal tooling, developer productivity, AI agents, and production systems.',
    url:          pageNum > 1 ? `${SITE.url}/blog/${pageNum}` : `${SITE.url}/blog`,
    publisher: {
      '@type': 'Organization',
      name:    SITE.name,
      url:     SITE.url,
    },
    inLanguage: 'en-US',
  };
}

export function schemaFAQ(items: { question: string; answer: string }[]) {
  return {
    '@context':  'https://schema.org',
    '@type':     'FAQPage',
    mainEntity:  items.map(item => ({
      '@type':        'Question',
      name:           item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
