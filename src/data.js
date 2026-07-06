/* =========================================================================
   CONTENT — grounded in Appinventiv's real published proof points.
   Sources: appinventiv.com homepage, /awards, client case studies.
   Nothing here is invented; swap freely, the UI adapts.
   ========================================================================= */

export const HERO_STATS = [
  { value: 3000, suffix: '+', label: 'Solutions delivered' },
  { value: 950, prefix: '$', suffix: 'M+', label: 'Raised for our clients' },
  { value: 150, suffix: '+', label: 'AI models in production' },
  { value: 35, suffix: '+', label: 'Industries served' },
]

/* the marquee/credibility strip */
export const TRUST_LOGOS = ['KFC', 'Adidas', 'IKEA', "Domino's", 'KPMG', 'Americana', "Sonny's"]

/* Services — titles, blurbs and CTAs are VERBATIM from appinventiv.com's
   "Beyond Development" section. Proof stats are verbatim from the client
   case-study carousel on the same homepage (verified 2026-07). */
export const SERVICES = [
  {
    id: 'consulting',
    index: '01',
    short: 'Consulting',
    title: 'Strategic Technology Consulting',
    blurb:
      'From architecture audits to digital transformation strategy, we help leaders align technology with business goals for measurable ROI.',
    cta: 'View Consulting Services',
    proof: { value: '50%', label: 'of KFC orders now via the native app' },
  },
  {
    id: 'product',
    index: '02',
    short: 'Product',
    title: 'Digital Product Development & Engineering',
    blurb:
      'As your digital product engineering company, we handle the full lifecycle of software development—from cloud-native applications to complex ERP systems.',
    cta: 'View Product Engineering Services',
    proof: { value: '2M+', label: 'app downloads for Adidas' },
  },
  {
    id: 'ai',
    index: '03',
    short: 'AI & Data',
    title: 'AI, Data and Analytics Solutions',
    blurb:
      'We integrate advanced AI, generative AI, and machine learning models to automate operations, predict trends, and personalize customer experiences at scale.',
    cta: 'View Artificial Intelligence Services',
    proof: { value: '4X', label: 'operational standards for Americana' },
  },
  {
    id: 'cloud',
    index: '04',
    short: 'Cloud',
    title: 'Cloud Operations and Cybersecurity',
    blurb:
      'As your IT service company, we engineer cloud-native environments rooted in Zero Trust principles, ensuring your infrastructure is as scalable as it is impenetrable.',
    cta: 'View Cybersecurity Services',
    proof: { value: '1,000+', label: 'locations unified for Sonny’s' },
  },
]

/* =========================================================================
   INVENTIVAI — dedicated AI section (chapter 3, task brief).
   Copy elevated from appinventiv.com's InventivAI block; proof points are
   real (150+ models in production, MyExec agentic GenAI, 35+ industries).
   ========================================================================= */
export const AV_AI = {
  eyebrow: 'InventivAI',
  label: 'AI Center of Excellence',
  titleLead: 'Building AI ecosystems that align with ',
  titleLede: 'your organization',
  /* lead — verbatim from the InventivAI screenshot brief */
  lead: 'InventivAI is our dedicated center of excellence, to help enterprises navigate the AI revolution. From custom LLMs to automated workflows, we move your business beyond the hype into practical, revenue-generating AI implementation.',
  /* promise — close paraphrase of the /artificial-intelligence/ value prop:
     "perform reliably in production, not just in pilots" + "integrate cleanly into enterprise ecosystems" */
  promise: 'We build AI that performs reliably in production — not just in pilots — and integrates cleanly into your enterprise ecosystem.',
  ctaPrimary: 'Book Your AI Advisory Session',
  ctaGhost: 'Discover InventivAI',

  /* the three cards + bullet items — verbatim from the InventivAI screenshot */
  capabilities: [
    { title: 'GenAI Integration', items: ['AI Agents', 'Chatbots', 'Coding Assistants'] },
    { title: 'Computer Vision', items: ['Quality Control', 'Facial Recognition'] },
    { title: 'Data Engineering', items: ['Building the infrastructure that feeds the AI.'] },
  ],

  /* AI practice at scale — verbatim from appinventiv.com/artificial-intelligence/ (fetched 2026-07-06) */
  stats: [
    { value: 150, suffix: '+', label: 'Custom AI models trained & deployed' },
    { value: 200, suffix: '+', label: 'Data scientists & AI engineers' },
    { value: 50, suffix: '+', label: 'Bespoke LLMs fine-tuned' },
    { value: 35, suffix: '+', label: 'Industries mastered' },
  ],

  /* proof in production — real client outcomes, verbatim from appinventiv.com homepage case studies */
  proof: [
    { client: 'KFC', value: 50, suffix: '%', label: 'of total orders via the native app', sub: '+22% digital conversion' },
    { client: 'Americana Group', value: 4, suffix: 'X', label: 'improvement in operational standards', sub: '100% dispatch automation' },
    { client: 'Adidas', value: 2, suffix: 'M+', label: 'downloads post-launch', sub: '500k new users acquired' },
    { client: "Sonny's Enterprises", value: 1000, suffix: '+', label: 'locations with unified data', sub: '90% faster reporting' },
  ],

  /* industries — verbatim subset from appinventiv.com/artificial-intelligence/ */
  industries: ['Healthcare', 'Finance', 'Restaurant', 'eCommerce', 'Aviation', 'Logistics', 'Real Estate', 'Automotive', 'Insurance', 'Manufacturing', 'Travel', 'Education'],
}

export const AI_CAPABILITIES = [
  { title: 'AI Agents & Copilots', desc: 'Autonomous agents and copilots wired into real workflows.' },
  { title: 'Generative AI', desc: 'GenAI integration, chatbots, and coding assistants.' },
  { title: 'Computer Vision', desc: 'Vision models for inspection, detection, and automation.' },
  { title: 'RAG & Knowledge', desc: 'Retrieval-augmented systems grounded in your data.' },
  { title: 'ML Development', desc: 'Custom models trained, deployed, and monitored.' },
  { title: 'AI Governance', desc: 'Responsible, auditable, compliant AI by design.' },
]

/* the InventivAI workflow — stage + short descriptor. No invented metrics. */
export const AI_PIPELINE = [
  { step: 'Ingest', detail: 'Enterprise data' },
  { step: 'Reason', detail: 'Models + context' },
  { step: 'Act', detail: 'Agents in workflow' },
  { step: 'Measure', detail: 'Outcomes tracked' },
]

export const TECH = {
  Cloud: ['AWS', 'Google Cloud', 'Microsoft Azure', 'Docker', 'Boomi'],
  Data: ['Databricks', 'Snowflake', 'Big Data', 'BI & Analytics'],
  'AI / ML': ['LLMs', 'Computer Vision', 'RAG', 'RPA', 'ML Ops'],
  Platforms: ['ServiceNow', 'Adobe', 'HubSpot', 'Magento'],
  Engineering: ['iOS', 'Android', 'React', 'Node', 'DevOps'],
}

export const CASE_RESULTS = [
  { client: 'KFC', result: '+22% digital conversion', detail: '50% of total orders via native app' },
  { client: 'Adidas', result: '2M+ downloads', detail: '500k new users acquired post-launch' },
  { client: 'Americana', result: '4X operational standards', detail: '100% dispatch automation' },
]

export const COMPANY_PROOF = [
  { value: 10, suffix: '+', label: 'Years engineering products' },
  { value: 1700, suffix: '+', label: 'Technology specialists' },
  { value: 15, suffix: '+', label: 'Global awards & recognitions' },
]

/* =========================================================================
   CHAPTER 3 — verbatim copy from appinventiv.com (fetched 2026-07-02).
   Do not paraphrase; the redesign keeps the site's exact language.
   ========================================================================= */

export const AV_HERO = {
  kicker: '10+ Years of Experience',
  title: 'Engineering the Next Generation of Digital Systems with AI',
  sub: 'Appinventiv engineers secure, scalable digital systems by combining strong architecture, data engineering, and AI capabilities, helping organizations move from strategy to reliable systems in production.',
  cta: 'Consult Our Strategy Team',
}

export const AV_STATS = [
  { value: 1700, suffix: '+', label: 'Technology Specialists', icon: '/hero-icons/tech-specialists.png' },
  { value: 3000, suffix: '+', label: 'Solutions', icon: '/hero-icons/solutions.png' },
  { value: 150, suffix: '+', label: 'AI Models', icon: '/hero-icons/ai-models.png' },
  { value: 35, suffix: '+', label: 'Industries', icon: '/hero-icons/industries.png' },
  { value: 15, suffix: '+', label: 'Global Recognitions & Awards', icon: '/hero-icons/awards.png' },
]

export const AV_TRANSFORMATION = {
  title: 'Beyond Development. We Deliver Transformation.',
  pillars: [
    'Strategic Technology Consulting',
    'Digital Product Development & Engineering',
    'AI, Data and Analytics Solutions',
    'Cloud Operations and Cybersecurity',
  ],
}

export const AV_CASES = {
  title: 'Innovation, Engineered by Appinventiv',
  sub: "You've seen how we helped Americana, Sonny's, and Adidas reclaim their market edge.",
  /* Each cover is the CLIENT's own brand colour. `ink` (light/dark) is derived
     from the colour's luminance in the component, so any swapped hex stays legible.
     NOTE: the guessed brand hexes are marked — confirm against the real brand kits. */
  items: [
    {
      client: 'Empire Hotels', color: '#123A5E' /* hotel navy */, tag: 'Blockchain Booking', year: '2024',
      image: '/innovation/empire-hotels.jpg',
      text: 'Built a blockchain-based booking app that keeps hidden fees and intermediaries out of hotel reservations.',
      note: 'A blockchain hotel booking platform.',
    },
    {
      client: 'Americana Group', color: '#E1231D' /* Americana red */, tag: 'Predictive Logistics', year: '2024',
      image: '/innovation/americana-group.jpg',
      text: 'Engineered a predictive logistics intelligence core for the QSR giant.',
      stats: [{ value: '100%', label: 'increase in dispatch automation' }, { value: '4X', label: 'improvement in operational standards' }],
    },
    {
      client: 'Flynas', color: '#00A9A6' /* flynas teal */, tag: 'Digital Airline', year: '2025',
      image: '/innovation/flynas.jpg',
      text: 'Re-engineered the digital passenger journey with an AI-native mobile ecosystem.',
      note: 'An AI-driven airline booking & in-app support app.',
    },
    {
      client: "Sonny's Enterprises", color: '#1D4E89' /* guess: enterprise blue */, tag: 'Data Platform', year: '2023',
      image: '/innovation/sonny-s-enterprises.jpg',
      text: 'Modernized legacy data infrastructure to drive real-time analytics.',
      stats: [{ value: '90%', label: 'faster report load' }, { value: '1,000+', label: 'locations unified' }],
    },
    {
      client: 'MyExec', color: '#161618' /* guess: executive near-black */, tag: 'Agentic GenAI', year: '2025',
      image: '/innovation/myexec.webp',
      text: 'Architected a Multi-Agent GenAI system functioning as an autonomous business consultant.',
      note: 'An AI virtual business consultant on a multi-agent RAG system.',
    },
    {
      client: 'KFC', color: '#E4002B' /* KFC red */, tag: 'Digital Commerce', year: '2024',
      image: '/innovation/kfc.jpg',
      text: 'Engineered a unified digital commerce ecosystem across 7 global markets.',
      stats: [{ value: '50%', label: 'orders via the native app' }, { value: '7', label: 'global markets live' }],
    },
    {
      client: 'Adidas', color: '#0B0B0D' /* Adidas black */, tag: 'Mobile Commerce', year: '2023',
      image: '/innovation/adidas.jpg',
      text: 'Designed an immersive mobile commerce experience to drive direct-to-consumer growth.',
      stats: [{ value: '2M+', label: 'app downloads' }, { value: '500K+', label: 'new users acquired' }],
    },
  ],
}

export const AV_CLIENTS = {
  title: 'Trusted by the Disruptors and Fortune 500s',
  names: [
    'Americana Group', 'Flynas', "Sonny's Enterprises", 'KFC', 'MyExec', 'Adidas',
    "Dr. Reddy's eLearning", 'IKEA', 'Tootle', 'DiabeticU', 'Honda', 'Empire Hotels', 'DRAG',
  ],
}

export const AV_EXPERTISE = {
  title: 'Deep Technical Expertise, Supporting Modern Systems',
  groups: {
    'AI Services': [
      'AI Development', 'AI Consulting', 'AI Chatbot Development', 'Generative AI Development',
      'AI Agent Development', 'Machine Learning Development', 'Computer Vision', 'AI Product Engineering',
    ],
    'Product Development': [
      'Product Design', 'Application Development', 'Software Development', 'DevOps', 'Quality Assurance',
    ],
    'Cloud & Security': [
      'Cloud Consulting', 'Cloud Migration', 'Cybersecurity Services', 'IoT Development', 'Blockchain Development',
    ],
    'Consulting': ['IT Consulting', 'Software Consulting', 'FinTech Consulting'],
    'Data Services': ['Big Data', 'Data Analytics'],
  },
}

export const AV_AWARDS = {
  title: 'Proven Expertise. Globally Accredited.',
  items: [
    { org: 'The Economic Times', text: 'Leader in AI-First Product Engineering' },
    { org: 'Clutch', text: 'Fastest-Growing Company' },
    { org: 'Deloitte', text: 'Fastest Growing Technology Company' },
    { org: 'MobileAppDaily', text: 'Fastest Growing AI Development Companies' },
    { org: 'Times Business Awards', text: 'Tech Company Of The Year' },
    { org: 'Entrepreneur', text: 'App Development Company of the Year' },
  ],
}

/* Award banners (real graphics dropped into /public/awards). Each entry pairs
   the artwork with an editorial caption so the showcase can label it. */
export const AV_AWARD_WALL = [
  { img: '/awards/et-leader-ai-first.png', org: 'ET Industry Changemakers', title: 'Leader in AI-First Product Engineering', year: '2025' },
  { img: '/awards/deloitte-fast50.png', org: 'Deloitte', title: 'Technology Fast 50 — India', year: '2024' },
  { img: '/awards/et-leadership-excellence.png', org: 'The Economic Times', title: 'Leadership Excellence Awards, North', year: '2025' },
  { img: '/awards/mobileappdaily-fastest-growing.png', org: 'MobileAppDaily', title: 'Fastest-Growing AI Development Company', year: '2024' },
  { img: '/awards/cio-preferred-partner.png', org: 'CIO Association', title: 'Preferred Partner — Future Tech', year: '2024' },
  { img: '/awards/clutch-global-spring.png', org: 'Clutch', title: 'Global Leader — Spring', year: '2024' },
  { img: '/awards/outlook-best-place-to-work.png', org: 'Outlook Business Spotlight', title: 'Best Place to Work', year: '2022' },
  { img: '/awards/et-leadership-laurel.png', org: 'The Economic Times', title: 'Leadership Excellence, North', year: '2025' },
]

export const AV_FINAL_CTA = {
  text: "Enterprise technology succeeds when architecture, intelligence, and execution align. Connect with Appinventiv's consulting and engineering teams to build systems that can last, scale responsibly, and stand up to real-world complexity.",
  button: 'Discuss Your Technology Strategy',
}
