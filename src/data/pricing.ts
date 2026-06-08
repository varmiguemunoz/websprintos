export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  featured: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'open-source',
    name: 'Open Source',
    subtitle: 'Self-Managed',
    price: '$0',
    period: 'forever',
    featured: false,
    features: [
      'Unlimited projects & tasks',
      'Full CLI & TUI access',
      'Real-time team presence',
      'Local PostgreSQL persistence',
      'GitHub integration',
      'REST API access',
    ],
    cta: 'Get Started',
    ctaHref: 'https://github.com/varmiguemunoz/sprintos',
  },
  {
    id: 'supporter',
    name: 'Supporter',
    subtitle: 'Cloud + Access to new features',
    price: '$5',
    period: 'one-time',
    featured: true,
    features: ['Everything in Open Source', 'Private cloud backup', 'Early access to new features'],
    cta: 'Buy Now',
    ctaHref: 'https://buy.stripe.com/6oU8wP5sIaO221l7mk1oI0g',
  },
];
