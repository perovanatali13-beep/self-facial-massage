export interface SiteContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    imageEmoji: string;
  };
  problems: { title: string; items: { title: string; text: string }[] };
  about: {
    name: string;
    role: string;
    text: string;
    mission: string;
    credentials: string[];
    imageEmoji: string;
  };
  contents: { title: string; items: { title: string; text: string }[] };
  outcomes: { title: string; items: string[] };
  faceAlarm: {
    badge: string;
    title: string;
    subtitle: string;
    features: { title: string; text: string }[];
    appStoreUrl: string;
    googlePlayUrl: string;
    siteUrl: string;
    imageUrl: string;
  };
  pricing: { title: string; price: string; features: string[]; ctaText: string };
  faq: { title: string; items: { q: string; a: string }[] };
  reviews: { title: string; images: string[] };
  contacts: { phone: string; email: string; telegram: string };
}

export interface Lesson {
  id: string;
  day: number;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  /** Приватный URL видеофайла в Vercel Blob (отдаётся через прокси /api/video/<id>). */
  videoFile: string;
  content: string;
  published: boolean;
  date: string;
}

export interface CourseData {
  intro: { title: string; tagline: string; instruction: string };
  lessons: Lesson[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}
