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
  overview: string;
  image: string;
  url: string;
  role: string;
  contribution: string;
  contributionDetails: string;
  highlights: string[];
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
    overview:
      'Credway needed a website that could explain a trust-dependent service without burying visitors in logistics language. The finished experience gives moving, storage, and related services a clear hierarchy, reinforces the company’s local positioning and service commitments, and keeps a direct enquiry path close to every decision point.',
    image: '/images/credway-website.jpg',
    url: 'https://credway.com.ng',
    role: 'Product design and frontend engineering',
    contribution:
      'Designed and built a responsive, static-first website that establishes Credway’s service hierarchy, local positioning, customer commitments, and direct enquiry paths, with a reusable design system and Netlify delivery.',
    contributionDetails:
      'I shaped the experience from information architecture through frontend delivery. That included defining reusable page patterns, balancing photography with concise service content, building the responsive implementation, and preparing the site for fast, dependable static delivery on Netlify.',
    highlights: [
      'Translated the service catalogue into a clear navigation and page hierarchy.',
      'Built reusable responsive sections instead of one-off landing-page blocks.',
      'Created focused enquiry journeys and prepared the production delivery setup.',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
  },
  {
    slug: 'skybod-carepass',
    title: 'Skybod CarePass',
    year: '2026',
    description: 'Compliance and jobs marketplace for the UK care industry.',
    overview:
      'Skybod CarePass brings job discovery and workforce compliance into one product for the UK care industry. Care professionals can maintain the information required to demonstrate readiness for work, while providers can find suitable people and review the records that support a hiring decision.',
    image: '/images/skybod_carepass-website.png',
    url: 'https://skybodcarepass.com',
    role: 'Product architecture and full-stack engineering',
    contribution:
      'Designed a platform that connects care providers with verified carers while centralising compliance documents, verification workflows, and job discovery.',
    contributionDetails:
      'I led the product architecture and full-stack implementation, turning separate job and compliance requirements into a coherent set of user journeys. The work covered the web experience, service boundaries, document and verification states, data modelling, and a containerised development and delivery workflow.',
    highlights: [
      'Structured carer profiles, compliance records, and verification states around real product workflows.',
      'Connected provider discovery and care-professional job journeys in one platform.',
      'Built the frontend and backend foundations and containerised the services with Docker.',
    ],
    tags: ['Next.js', 'NestJS', 'TypeScript', 'MongoDB', 'Docker'],
    featured: true,
  },
  {
    slug: 'naijagrocer',
    title: 'NaijaGrocer',
    year: '2025',
    description: 'Subscription-based food packs and grocery delivery across Nigeria.',
    overview:
      'NaijaGrocer turns recurring household food shopping into a more manageable digital service. Customers can choose curated food packs, subscribe to repeat orders, spread payments through wallet instalments, and coordinate delivery without losing sight of order or payment status.',
    image: '/images/naijagrocer-website.png',
    url: 'https://naijagrocer.com',
    role: 'Product engineering and technical delivery',
    contribution:
      'Built the product experience around curated food packs, subscriptions, wallet instalments, referrals, payment processing, inventory, and delivery scheduling.',
    contributionDetails:
      'I worked across product engineering and technical delivery, translating a multi-part commercial model into clear customer and operational flows. The implementation connects subscriptions, wallets, referrals, payments, stock, and delivery scheduling while keeping the purchasing experience understandable on smaller screens.',
    highlights: [
      'Implemented the food-pack, subscription, wallet-instalment, and referral journeys.',
      'Integrated Paystack and handled the payment states surrounding customer orders.',
      'Connected inventory and delivery scheduling to the customer-facing product flow.',
    ],
    tags: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Paystack'],
    featured: true,
  },
  {
    slug: 'entrecore',
    title: 'Entrecore',
    year: '2025',
    description: 'Organized intelligence platform for business leaders.',
    overview:
      'Entrecore helps leadership teams turn fragmented business information into structured, decision-ready intelligence. Rather than leaving important context scattered across tools and documents, the platform creates a clearer system for organising knowledge and bringing relevant information into view.',
    image: '/images/entrecore-website.png',
    url: 'https://entrecore.com',
    role: 'Engineering lead and systems architect',
    contribution:
      'Led the engineering direction for a system that organises fragmented business information and turns it into useful, decision-ready intelligence.',
    contributionDetails:
      'As engineering lead and systems architect, I defined the technical direction across the product interface, application services, data-processing work, and relational data layer. I also shaped the containerised delivery approach used to run the platform in Microsoft Azure environments.',
    highlights: [
      'Defined clear boundaries between the product interface, APIs, and data-processing services.',
      'Designed the PostgreSQL-backed foundation for structured business information.',
      'Established Docker-based delivery for services running in Microsoft Azure.',
    ],
    tags: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Azure', 'Docker'],
    featured: true,
  },
  {
    slug: 'notjustevent',
    title: 'NotJustEvent',
    year: '2025',
    description: 'An all-in-one event management and ticketing platform.',
    overview:
      'NotJustEvent gives organisers one place to create events, sell and validate tickets, manage promotions, and follow payment activity. It also provides the backend foundation needed for attendees to discover events and move through a dependable purchase journey.',
    image: '/images/nje-website.png',
    url: 'https://notjustevent.com',
    role: 'Lead software engineer',
    contribution:
      'Led backend delivery across event creation, ticketing, payments, promo-code workflows, and the APIs powering the product experience.',
    contributionDetails:
      'I built the backend platform from the ground up and now lead the engineering team responsible for its continued delivery. My work includes the event and ticketing services, payment integrations, promotional-code behaviour, API design, code review, and the technical decisions supporting a product used by more than 10,000 active users.',
    highlights: [
      'Designed and delivered the event-management and ticketing services.',
      'Integrated Stripe and Paystack across the ticket-purchase lifecycle.',
      'Led a five-person engineering team and introduced Docker into the delivery workflow.',
    ],
    tags: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Azure', 'Docker'],
  },
  {
    slug: 'yacht-crew-center',
    title: 'Yacht Crew Center',
    year: '2025',
    description: 'Maritime crew management, recruitment, and compliance platform.',
    overview:
      'Yacht Crew Center combines crew discovery, recruitment information, certification records, and maritime compliance in a mobile-ready product. It gives crew members and the teams hiring them a shared place to manage the information that determines whether someone is ready for a role.',
    image: '/images/ycc-website.png',
    url: 'https://yachtcrewcenter.com',
    role: 'Engineering lead',
    contribution:
      'Led delivery of a mobile-ready platform for crew discovery, certification management, and maritime compliance workflows.',
    contributionDetails:
      'I led the engineering delivery across the responsive product experience and the services supporting recruitment and compliance. The work focused on keeping detailed crew and certification information usable, maintaining clear workflow states, and establishing a platform structure that could grow with new operational requirements.',
    highlights: [
      'Connected crew discovery and recruitment workflows in one responsive experience.',
      'Structured certification records and maritime compliance information for practical review.',
      'Guided implementation decisions across the frontend, services, and PostgreSQL data layer.',
    ],
    tags: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Azure'],
  },
  {
    slug: 'yoris-africa',
    title: 'Yoris Africa',
    year: '2024',
    description: 'Digital product platform for a logistics company.',
    overview:
      'Yoris Africa’s digital platform supports the operational activity behind a logistics business. It combines customer-facing and administrative capabilities with the APIs and asynchronous services required to keep high-volume requests and internal workflows moving reliably.',
    image: '/images/yoris-website.png',
    url: 'https://yoris.africa',
    role: 'Software engineer',
    contribution:
      'Built and maintained APIs, introduced a microservice workflow with RabbitMQ, revamped the administration interface, and supported containerised delivery.',
    contributionDetails:
      'I worked across backend systems, internal product tooling, and technical delivery. I built TypeScript APIs serving more than 50,000 daily requests, introduced RabbitMQ-based service workflows, rebuilt key parts of the React administration experience, and used Docker to make deployments faster and more repeatable.',
    highlights: [
      'Built and maintained TypeScript APIs handling more than 50,000 daily requests.',
      'Introduced RabbitMQ-based services for asynchronous operational workflows.',
      'Improved the React administration product and containerised delivery with Docker.',
    ],
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
