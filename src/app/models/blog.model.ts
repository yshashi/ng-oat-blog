export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: 'admin' | 'writer' | 'reader';
}

export interface Category {
  id: string;
  label: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: Category;
  tags: string[];
  author: Author;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number; // minutes
  views: number;
  likes: number;
  commentsCount: number;
  status: 'published' | 'draft';
  featured: boolean;
  allowComments: boolean;
  visibility: 'public' | 'private' | 'draft';
}

export interface BlogComment {
  id: string;
  blogId: string;
  author: Author;
  content: string;
  createdAt: Date;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export const AUTHORS: Author[] = [
  {
    id: 'a1',
    name: 'Sashi Kumar',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sashi',
    bio: 'Full-stack developer & open-source enthusiast.',
    role: 'admin',
  },
  {
    id: 'a2',
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Priya',
    bio: 'Frontend engineer specialising in Angular & design systems.',
    role: 'writer',
  },
  {
    id: 'a3',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex',
    bio: 'DevOps engineer who loves automation & cloud.',
    role: 'writer',
  },
  {
    id: 'a4',
    name: 'Maya Chen',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Maya',
    bio: 'UI/UX designer passionate about accessible interfaces.',
    role: 'writer',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', slug: 'all' },
  { id: 'c1', label: 'Angular', slug: 'angular' },
  { id: 'c2', label: 'TypeScript', slug: 'typescript' },
  { id: 'c3', label: 'CSS', slug: 'css' },
  { id: 'c4', label: 'DevOps', slug: 'devops' },
  { id: 'c5', label: 'Design', slug: 'design' },
  { id: 'c6', label: 'Performance', slug: 'performance' },
];

const ARTICLE_BODY = `
## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Getting Started

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

\`\`\`typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  template: \\\`<h1>{{ title() }}</h1>\\\`
})
export class ExampleComponent {
  title = signal('Hello World');
}
\`\`\`

### Key Concepts

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

- **Signals** — reactive primitives for state management
- **Standalone components** — no more NgModules
- **Control flow** — \`@if\`, \`@for\`, \`@switch\` built-in syntax

### Best Practices

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Conclusion

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
`;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'angular-signals-deep-dive',
    title: 'Angular Signals: A Deep Dive',
    subtitle: 'Understanding reactive primitives in Angular 21',
    content: ARTICLE_BODY,
    excerpt:
      'Explore how Angular Signals revolutionise state management with fine-grained reactivity and zone-less change detection.',
    coverImage:
      'https://res.cloudinary.com/dmcpsaspr/image/upload/c_fill,h_800,w_1200/v1708783281/BlogImages/z3zcjptupopkejqphsed.jpg?_a=BAMCcSiu0',
    category: CATEGORIES[0],
    tags: ['angular', 'signals', 'reactivity'],
    author: AUTHORS[0],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-20'),
    readingTime: 8,
    views: 2340,
    likes: 187,
    commentsCount: 24,
    status: 'published',
    featured: true,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b2',
    slug: 'building-design-systems-with-css',
    title: 'Building Design Systems with CSS',
    subtitle: 'From tokens to components — a practical guide',
    content: ARTICLE_BODY,
    excerpt:
      'Learn how to build a cohesive design system using CSS custom properties, utility classes, and semantic tokens.',
    coverImage:
      'https://res.cloudinary.com/dmcpsaspr/image/upload/c_fill,h_800,w_1200/v1708783281/BlogImages/c6wjdeldzw38hiwjrlxq.jpg?_a=BAMCcSiu0',
    category: CATEGORIES[2],
    tags: ['css', 'design-system', 'tokens'],
    author: AUTHORS[3],
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-12'),
    readingTime: 12,
    views: 1890,
    likes: 145,
    commentsCount: 18,
    status: 'published',
    featured: true,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b3',
    slug: 'typescript-5-new-features',
    title: "TypeScript 5.x: What's New",
    subtitle: 'Decorators, const type parameters, and more',
    content: ARTICLE_BODY,
    excerpt:
      'A comprehensive look at the latest TypeScript features that make your code safer and more expressive.',
    coverImage:
      'https://res.cloudinary.com/dmcpsaspr/image/upload/c_fill,h_800,w_1200/v1708783281/BlogImages/ktlcwdgdcsjiodkuqu1k.jpg?_a=BAMCcSiu0',
    category: CATEGORIES[1],
    tags: ['typescript', 'javascript', 'language'],
    author: AUTHORS[1],
    createdAt: new Date('2026-02-08'),
    updatedAt: new Date('2026-02-09'),
    readingTime: 10,
    views: 3120,
    likes: 256,
    commentsCount: 32,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b4',
    slug: 'ci-cd-pipelines-github-actions',
    title: 'CI/CD Pipelines with GitHub Actions',
    subtitle: 'Automate your deployment workflow',
    content: ARTICLE_BODY,
    excerpt:
      'Set up robust CI/CD pipelines using GitHub Actions for Angular apps with testing, linting, and deployment.',
    coverImage:
      'https://res.cloudinary.com/dmcpsaspr/image/upload/c_fill,h_800,w_1200/v1708783281/BlogImages/z8z2ctowo5v4tbdarkpg.jpg?_a=BAMCcSiu0',
    category: CATEGORIES[3],
    tags: ['devops', 'ci-cd', 'github-actions'],
    author: AUTHORS[2],
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-06'),
    readingTime: 15,
    views: 1560,
    likes: 98,
    commentsCount: 12,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b5',
    slug: 'accessible-forms-angular',
    title: 'Building Accessible Forms in Angular',
    subtitle: 'ARIA, validation, and keyboard navigation',
    content: ARTICLE_BODY,
    excerpt:
      'Master accessibility in Angular forms with proper ARIA attributes, live regions, and keyboard interaction patterns.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    category: CATEGORIES[0],
    tags: ['angular', 'accessibility', 'forms'],
    author: AUTHORS[1],
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-01-30'),
    readingTime: 11,
    views: 980,
    likes: 76,
    commentsCount: 9,
    status: 'published',
    featured: true,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b6',
    slug: 'css-container-queries',
    title: 'CSS Container Queries in Practice',
    subtitle: 'Responsive design without media queries',
    content: ARTICLE_BODY,
    excerpt:
      'Discover how CSS container queries enable truly component-level responsive design that adapts to parent size.',
    coverImage: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=400&fit=crop',
    category: CATEGORIES[2],
    tags: ['css', 'responsive', 'container-queries'],
    author: AUTHORS[3],
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-01-23'),
    readingTime: 7,
    views: 1340,
    likes: 112,
    commentsCount: 15,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b7',
    slug: 'web-performance-core-vitals',
    title: 'Web Performance & Core Web Vitals',
    subtitle: 'Optimise LCP, FID, and CLS for Angular apps',
    content: ARTICLE_BODY,
    excerpt:
      'Practical techniques to improve Core Web Vitals scores in Angular applications using lazy loading, image optimisation, and SSR.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    category: CATEGORIES[5],
    tags: ['performance', 'web-vitals', 'optimisation'],
    author: AUTHORS[0],
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-19'),
    readingTime: 14,
    views: 2100,
    likes: 178,
    commentsCount: 21,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b8',
    slug: 'ux-design-principles-developers',
    title: 'UX Design Principles for Developers',
    subtitle: 'Think like a designer, code like an engineer',
    content: ARTICLE_BODY,
    excerpt:
      'Key UX design principles every developer should know — from visual hierarchy to Gestalt laws and micro-interactions.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    category: CATEGORIES[4],
    tags: ['design', 'ux', 'frontend'],
    author: AUTHORS[3],
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-14'),
    readingTime: 9,
    views: 1670,
    likes: 134,
    commentsCount: 17,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b9',
    slug: 'angular-ssr-hydration',
    title: 'Angular SSR & Hydration Explained',
    subtitle: 'Server-side rendering for faster first paint',
    content: ARTICLE_BODY,
    excerpt:
      'Understand Angular SSR with hydration — how it works, when to use it, and common pitfalls to avoid.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    category: CATEGORIES[0],
    tags: ['angular', 'ssr', 'hydration'],
    author: AUTHORS[0],
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-10'),
    readingTime: 13,
    views: 2450,
    likes: 198,
    commentsCount: 28,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b10',
    slug: 'docker-for-frontend-devs',
    title: 'Docker for Frontend Developers',
    subtitle: 'Containerise your dev environment',
    content: ARTICLE_BODY,
    excerpt:
      'A beginner-friendly guide to Docker for frontend developers — from Dockerfile basics to multi-stage builds.',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
    category: CATEGORIES[3],
    tags: ['devops', 'docker', 'containers'],
    author: AUTHORS[2],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-05'),
    readingTime: 10,
    views: 1890,
    likes: 143,
    commentsCount: 19,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b11',
    slug: 'signal-forms-angular',
    title: 'Signal Forms in Angular 21',
    subtitle: 'Type-safe reactive forms with zero boilerplate',
    content: ARTICLE_BODY,
    excerpt:
      "Explore Angular 21's new Signal Forms API — schema-based validation, type-safe field access, and seamless signal integration.",
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
    category: CATEGORIES[0],
    tags: ['angular', 'forms', 'signals'],
    author: AUTHORS[1],
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2025-12-30'),
    readingTime: 11,
    views: 3400,
    likes: 267,
    commentsCount: 35,
    status: 'published',
    featured: true,
    allowComments: true,
    visibility: 'public',
  },
  {
    id: 'b12',
    slug: 'micro-frontends-module-federation',
    title: 'Micro-Frontends with Module Federation',
    subtitle: 'Scale your Angular monolith into micro-apps',
    content: ARTICLE_BODY,
    excerpt:
      'Learn how to split a large Angular application into independently deployable micro-frontends using Webpack Module Federation.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
    category: CATEGORIES[0],
    tags: ['angular', 'micro-frontends', 'architecture'],
    author: AUTHORS[2],
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-22'),
    readingTime: 16,
    views: 1230,
    likes: 89,
    commentsCount: 11,
    status: 'published',
    featured: false,
    allowComments: true,
    visibility: 'public',
  },
];

export const COMMENTS: BlogComment[] = [
  {
    id: 'cm1',
    blogId: 'b1',
    author: AUTHORS[1],
    content: 'Great article! Signals really simplify state management.',
    createdAt: new Date('2026-02-16'),
  },
  {
    id: 'cm2',
    blogId: 'b1',
    author: AUTHORS[2],
    content: 'I migrated my app to signals last week — huge performance boost.',
    createdAt: new Date('2026-02-17'),
  },
  {
    id: 'cm3',
    blogId: 'b1',
    author: AUTHORS[3],
    content: 'Would love to see a follow-up on computed signals vs effects.',
    createdAt: new Date('2026-02-18'),
  },
  {
    id: 'cm4',
    blogId: 'b2',
    author: AUTHORS[0],
    content: 'The token-based approach is so clean. Using it in our design system now.',
    createdAt: new Date('2026-02-11'),
  },
  {
    id: 'cm5',
    blogId: 'b2',
    author: AUTHORS[1],
    content: 'CSS custom properties are underrated. Great write-up!',
    createdAt: new Date('2026-02-12'),
  },
  {
    id: 'cm6',
    blogId: 'b3',
    author: AUTHORS[0],
    content: 'The decorator changes in TS 5 are game-changing.',
    createdAt: new Date('2026-02-09'),
  },
  {
    id: 'cm7',
    blogId: 'b3',
    author: AUTHORS[3],
    content: 'Finally proper decorator support without experimental flags!',
    createdAt: new Date('2026-02-10'),
  },
  {
    id: 'cm8',
    blogId: 'b5',
    author: AUTHORS[0],
    content: 'Accessibility should be the default, not an afterthought. Thanks for this.',
    createdAt: new Date('2026-01-29'),
  },
  {
    id: 'cm9',
    blogId: 'b7',
    author: AUTHORS[1],
    content: 'Our LCP went from 3.2s to 1.4s after following these tips!',
    createdAt: new Date('2026-01-19'),
  },
  {
    id: 'cm10',
    blogId: 'b9',
    author: AUTHORS[2],
    content: 'SSR + hydration is a killer combo for SEO.',
    createdAt: new Date('2026-01-09'),
  },
  {
    id: 'cm11',
    blogId: 'b11',
    author: AUTHORS[0],
    content: 'Signal Forms are the future. No more FormBuilder boilerplate!',
    createdAt: new Date('2025-12-29'),
  },
  {
    id: 'cm12',
    blogId: 'b11',
    author: AUTHORS[3],
    content: 'The type safety is incredible — caught 3 bugs during migration.',
    createdAt: new Date('2025-12-30'),
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Sashi Kumar',
    role: 'Founder & Lead Dev',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sashi',
    bio: 'Passionate about open-source and developer experience.',
  },
  {
    name: 'Priya Sharma',
    role: 'Frontend Lead',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Priya',
    bio: 'Angular expert and design system advocate.',
  },
  {
    name: 'Alex Johnson',
    role: 'DevOps Engineer',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex',
    bio: 'Automating everything, one pipeline at a time.',
  },
  {
    name: 'Maya Chen',
    role: 'UX Designer',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Maya',
    bio: 'Creating delightful interfaces that everyone can use.',
  },
];

export const FAQ_ITEMS = [
  {
    title: 'What is LetsBlog?',
    content:
      'LetsBlog is a modern blogging platform built with Angular 21 and the ng-oat component library. It showcases best practices in component-driven development.',
    open: false,
  },
  {
    title: 'Is LetsBlog open source?',
    content:
      'Yes! LetsBlog is open source and available on GitHub. Feel free to fork, contribute, or use it as a reference project.',
    open: false,
  },
  {
    title: 'What technologies are used?',
    content:
      'LetsBlog uses Angular 21 with Signal Forms, the @letsprogram/ng-oat UI library (50+ components), and CSS custom properties for theming.',
    open: false,
  },
  {
    title: 'Can I write blog posts?',
    content:
      'Absolutely! After registering and verifying your email via OTP, you can create, edit, and publish blog posts with a rich editing experience.',
    open: false,
  },
  {
    title: 'How does theming work?',
    content:
      'LetsBlog supports light, dark, and system themes via the NgOatThemeSelector component. Theme preferences are persisted in localStorage.',
    open: false,
  },
  {
    title: 'Is it accessible?',
    content:
      'Yes. All ng-oat components follow WAI-ARIA guidelines with proper keyboard navigation, focus management, and screen reader support.',
    open: false,
  },
];
