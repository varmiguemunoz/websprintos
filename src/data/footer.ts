export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export const footerLinks: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Quick Start',    href: '#install' },
      { label: 'CLI Reference',  href: '#cli' },
      { label: 'REST API',       href: '#api' },
      { label: 'MCP Server',     href: '/mcp' },
      { label: 'Self-Hosting',   href: '/blog/self-hosting-sprintos-postgresql' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'vs Linear',      href: '/vs/linear' },
      { label: 'vs Taskwarrior', href: '/vs/taskwarrior' },
    ],
  },
  {
    title: 'Blog',
    links: [
      { label: 'All Articles', href: '/blog' },
      { label: 'Dev Tips',     href: '/blog?category=dev-tips' },
      { label: 'AI Tools',     href: '/blog?category=ai-tools' },
      { label: 'Automation',   href: '/blog?category=automation' },
    ],
  },
];

export const footerMeta = {
  logo: '⚡',
  name: 'SprintOS',
  tagline: 'The terminal-first project manager for developer teams.',
  copyright: `© ${new Date().getFullYear()} SprintOS. MIT License.`,
  github: 'https://github.com/varmiguemunoz/sprintos',
};
