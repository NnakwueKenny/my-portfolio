export const profile = {
  familiarName: 'Kene',
  fullName: 'Kenechukwu Nnakwue',
  brandName: 'CodeHermit',
  title: 'Senior Software Engineer',
  location: 'Nigeria',
  summary:
    'Senior software engineer with 7+ years across product architecture, full-stack development, cloud delivery, and technical leadership.',
  email: 'nnakwuekenny@gmail.com',
  github: 'https://github.com/KeneHermitCoder',
  linkedin: 'https://www.linkedin.com/in/kenechukwu-nnakwue-a854081b5',
  twitter: 'https://twitter.com/kenny_nnakwue',
  resume: '/Kenechukwu_Nnakwue_CV_2026.pdf',
};

export const capabilities = [
  'Angular',
  'React',
  'Vue',
  'TypeScript',
  'Node.js',
  'NestJS',
  'Python',
  'FastAPI',
  'React Native',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Azure',
  'Docker',
  'GitHub Actions',
];

export type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  image: string;
  url: string;
  role: string;
  contribution: string;
  tags: string[];
  featured?: boolean;
  imagePosition?: string;
};

export const projects: Project[] = [
  {
    slug: 'credway',
    title: 'Credway',
    year: '2026',
    description: 'Media-first marketing website for a Nigerian moving and storage company.',
    image: '/images/credway-website.jpg',
    url: 'https://credway.com.ng',
    role: 'Product design and frontend engineering',
    contribution:
      'Designed and built a responsive, static-first website that establishes Credway’s service hierarchy, local positioning, customer commitments, and direct enquiry paths, with a reusable design system and Netlify delivery.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
  },
  {
    slug: 'skybod-carepass',
    title: 'Skybod CarePass',
    year: '2026',
    description: 'Compliance and jobs marketplace for the UK care industry.',
    image: '/images/skybod_carepass-website.png',
    url: 'https://skybodcarepass.com',
    role: 'Product architecture and full-stack engineering',
    contribution:
      'Designed a platform that connects care providers with verified carers while centralising compliance documents, verification workflows, and job discovery.',
    tags: ['Next.js', 'NestJS', 'TypeScript', 'MongoDB'],
    featured: true,
  },
  {
    slug: 'naijagrocer',
    title: 'NaijaGrocer',
    year: '2025',
    description: 'Subscription-based food packs and grocery delivery across Nigeria.',
    image: '/images/naijagrocer-website.png',
    url: 'https://naijagrocer.com',
    role: 'Product engineering and technical delivery',
    contribution:
      'Built the product experience around curated food packs, subscriptions, wallet instalments, referrals, payment processing, inventory, and delivery scheduling.',
    tags: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Paystack'],
    featured: true,
  },
  {
    slug: 'entrecore',
    title: 'Entrecore',
    year: '2025',
    description: 'Organized intelligence platform for business leaders.',
    image: '/images/entrecore-website.png',
    url: 'https://entrecore.com',
    role: 'Engineering lead and systems architect',
    contribution:
      'Led the engineering direction for a system that organises fragmented business information and turns it into useful, decision-ready intelligence.',
    tags: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Azure'],
    featured: true,
  },
  {
    slug: 'notjustevent',
    title: 'NotJustEvent',
    year: '2025',
    description: 'An all-in-one event management and ticketing platform.',
    image: '/images/nje-website.png',
    url: 'https://notjustevent.com',
    role: 'Lead software engineer',
    contribution:
      'Led backend delivery across event creation, ticketing, payments, promo-code workflows, and the APIs powering the product experience.',
    tags: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Azure'],
  },
  {
    slug: 'yacht-crew-center',
    title: 'Yacht Crew Center',
    year: '2025',
    description: 'Maritime crew management, recruitment, and compliance platform.',
    image: '/images/ycc-website.png',
    url: 'https://yachtcrewcenter.com',
    role: 'Engineering lead',
    contribution:
      'Led delivery of a mobile-ready platform for crew discovery, certification management, and maritime compliance workflows.',
    tags: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Azure'],
  },
  {
    slug: 'yoris-africa',
    title: 'Yoris Africa',
    year: '2024',
    description: 'Digital product platform for a logistics company.',
    image: '/images/yoris-website.png',
    url: 'https://yoris.africa',
    role: 'Software engineer',
    contribution:
      'Built and maintained APIs, introduced a microservice workflow with RabbitMQ, revamped the administration interface, and supported containerised delivery.',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
  },
];

export type Experience = {
  company: string;
  title: string;
  period: string;
  mode: string;
  logo?: string;
  current?: boolean;
  summary: string;
};

export const experiences: Experience[] = [
  {
    company: 'Techsense Developers',
    title: 'Head of Engineering',
    period: 'Nov 2025 — Present',
    mode: 'Remote',
    logo: '/images/techsensedev-logo.jpeg',
    current: true,
    summary:
      'Lead the engineering team, set technical direction, oversee scalable frontend and backend systems, and establish practical standards for code review, documentation, CI/CD, release quality, and technical debt.',
  },
  {
    company: 'NotJustEvent',
    title: 'Lead Software Engineer',
    period: 'Jul 2023 — Present',
    mode: 'Remote',
    logo: '/images/notjustevent-logo.jpeg',
    current: true,
    summary:
      'Built the backend platform from scratch, designed event and ticketing microservices, integrated Stripe and Paystack, and lead a five-person engineering team delivering systems used by more than 10,000 active users.',
  },
  {
    company: 'LogRocket',
    title: 'Content Advisory Board Member',
    period: 'Jan 2022 — Present',
    mode: 'Remote',
    logo: '/images/logrocket-logo.png',
    current: true,
    summary:
      'Review developer-focused articles and videos, provide actionable technical feedback, and contribute industry insight to editorial strategy and content direction.',
  },
  {
    company: 'Punch Group',
    title: 'Software Engineering Lead',
    period: 'Mar 2025 — Jul 2025',
    mode: 'Miami, US',
    logo: '/images/punch-group-logo.jpeg',
    summary:
      'Led cross-functional technical execution, reviewed architecture and implementation, mentored engineers, and improved collaboration and delivery quality across product, design, and engineering.',
  },
  {
    company: 'Punch Group',
    title: 'Software Engineer',
    period: 'Jan 2025 — Jul 2025',
    mode: 'Miami, US',
    logo: '/images/punch-group-logo.jpeg',
    summary:
      'Developed product features, contributed to maintainable software delivery, conducted code reviews, and provided technical guidance to junior engineers.',
  },
  {
    company: 'Yoris Africa',
    title: 'Software Engineering Lead',
    period: 'Jan 2023 — Jan 2025',
    mode: 'Remote',
    logo: '/images/yoris-logo.jpeg',
    summary:
      'Built TypeScript APIs serving more than 50,000 daily requests, designed RabbitMQ-based services, improved the React administration experience, and reduced deployment time through Docker-based delivery.',
  },
  {
    company: 'Stemlab NG',
    title: 'Full-stack Web Developer',
    period: 'Oct 2021 — Dec 2022',
    mode: 'On-site',
    logo: '/images/stemlab-logo.png',
    summary:
      'Led client web products from requirements through launch using React and Node.js, mentored junior developers, and introduced ESLint and pull-request review workflows.',
  },
];
