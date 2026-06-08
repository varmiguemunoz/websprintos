export interface NavItem {
  label: string;
  href: string;
}

export const navigationItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Install',  href: '#install' },
  { label: 'CLI',      href: '#cli' },
  { label: 'API',      href: '#api' },
  { label: 'MCP',      href: '#mcp' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'Blog',     href: '/blog' },
];

export const navCta = {
  label: 'GitHub',
  href:  'https://github.com/varmiguemunoz/sprintos',
};

export const navPrimary = {
  label: 'Deploy Now',
  href:  '#install',
};
