import { withBase } from "./utils/helpers";

export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Hero = {
  eyebrowText?: string;
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};

export type About = {
  title?: string;
  text?: string;
};

export type Blog = {
  description?: string;
};

export type ContactInfo = {
  title?: string;
  text?: string;
  email?: {
    text?: string;
    href?: string;
    email?: string;
  };
  socialProfiles?: {
    text?: string;
    href?: string;
  }[];
};

export type Subscribe = {
  title?: string;
  text?: string;
  formUrl: string;
};

export type SiteConfig = {
  website: string;
  logo?: Image;
  title: string;
  description: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  about?: About;
  contactInfo?: ContactInfo;
  subscribe?: Subscribe;
  blog?: Blog;
  postsPerPage?: number;
  recentPostLimit: number;
  projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
  website: 'https://imran-nazir.com',
  title: 'Imran Nazir',
  description: 'My corner of the web',
  image: {
    src: '/space-ahead-preview.jpeg',
    alt: 'Space Ahead ✨ - A minimal space-inspired personal blog template, created by Siddhesh Thadeshwar.'
  },
  headerNavLinks: [
    {
      text: 'Home',
      href: withBase('/')
    },
    {
      text: 'Blog',
      href: withBase('/blog')
    },
    {
      text: 'Tags',
      href: withBase('/tags')
    },
    {
      text: 'About',
      href: withBase('/about')
    },
    {
      text: 'Contact',
      href: withBase('/contact')
    }
  ],
  footerNavLinks: [
    {
      text: 'About',
      href: withBase('/about')
    },
    {
      text: 'Contact',
      href: withBase('/contact')
    },
    {
      text: 'RSS Feed',
      href: withBase('/rss.xml')
    },
    {
      text: 'Sitemap',
      href: withBase('/sitemap-index.xml')
    }
  ],
  socialLinks: [
    // {
    //   text: 'Dribbble',
    //   href: 'https://dribbble.com/'
    // },
    // {
    //   text: 'Instagram',
    //   href: 'https://instagram.com/'
    // },
    // {
    //   text: 'X/Twitter',
    //   href: 'https://twitter.com/'
    // }
  ],
  hero: {
    eyebrowText: '',
    title: 'My Corner of the Web',
    text: "Written by Imran Nazir.",
    image: {
      src: '/assets/images/dddynamite.svg',
      alt: 'A person sitting at a desk in front of a computer'
    },
    actions: [
      {
        text: 'Read Now',
        href: withBase('/blog')
      },
      {
        text: 'Subscribe',
        href: '#subscribe'
      }
    ]
  },
  about: {
    title: 'About',
    text: "I'm Imran and I'm a Web Developer. I have built front-end applications, APIs, API integrations, order processing systems and dashboards. I have worked with major retailers such as Selfridges and Dunelm to successfully migrate their eCommerce platforms to the cloud. In 2024 gained an Amazon Web Services(AWS) Developer Certification",
  },
  contactInfo: {
    title: 'Contact',
    text: "Hi! Whether you have a question, a suggestion, or just want to share your thoughts, I'm all ears. Feel free to get in touch through any of the methods below:",
    email: {
      text: "Drop me an email and I’ll do my best to respond as soon as possible.",
      href: "mailto:support@pink-llama.dev",
      email: "support at pink-llama.dev"
    },
    socialProfiles: [
      {
        text: "LinkedIn",
        href: "https://www.linkedin.com/i8r"
      },
      {
        text: "Instagram",
        href: "https://www.instagram.com/imrannazirmir"
      },
      {
        text: "GitHub",
        href: "https://github.com/TimeBandit"
      }
    ]
  },
  subscribe: {
    title: 'Subscribe',
    text: 'One update per week. All my latest stories in your inbox.',
    formUrl: '#'
  },
  blog: {
    description: "Read about my adventures, thoughts and explorations."
  },
  postsPerPage: 6,
  recentPostLimit: 3
};

export default siteConfig;
