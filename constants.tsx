
import { NavLink, Product, BlogPost, FAQItem } from './types';

// Appending optimization parameters for production performance
const OPT = "&w=800&q=75&auto=format";

export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1587491439243-7f722a84d4ae?auto=format&fit=crop&q=80&w=800";

export const NAVIGATION_LINKS: NavLink[] = [
  { label: 'HOME', href: '/' },
  { 
    label: 'SHOP', 
    href: '/shop'
  },
  { label: 'SERVICES', href: '/services' },
  { label: 'ABOUT', href: '/about' },
  { label: 'BLOGS', href: '/blogs' },
  { label: 'CONTACT', href: '/contact' },
];

export const INITIAL_CATEGORIES = [
  {
    title: 'Machines',
    items: ['Espresso Machines', 'Commercial Systems', 'Automatic', 'Manual Lever'],
    image: `https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?${OPT}`,
    video: 'https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4'
  },
  {
    title: 'Grinders',
    items: ['Domestic Grinders', 'Commercial Grinders', 'Burr Sets', 'Accessories'],
    image: `https://images.unsplash.com/photo-1618116523910-1840b2f69830?${OPT}`,
    video: 'https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4'
  },
  {
    title: 'Blenders',
    items: ['High-Performance', 'Commercial Blenders', 'Personal Blenders'],
    image: `https://images.unsplash.com/photo-1570962386925-632003d52622?${OPT}`,
    video: ''
  },
  {
    title: 'Accessories',
    items: ['Barista Tools', 'Cleaning Supplies', 'Parts & Spares', 'Drinkware'],
    image: `https://images.unsplash.com/photo-1544655615-5654316d2e61?${OPT}`,
    video: 'https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4'
  }
];

export const BRAND_LOGOS = [
  'Technivorm', 'Bialetti', 'Gaggia', 'La Marzocco', 'Fellow', 'PUQpress', 'AeroPress',
  'Toddy', 'Mahlkonig', 'Baratza', 'Hario', 'Nuova Simonelli', 'Commandante'
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I choose the right espresso machine?',
    answer: 'Consider your daily volume, space, and whether you prefer manual control or automated convenience. Our team is available via WhatsApp for personalized advice.'
  },
  {
    question: 'Do you offer warranty on equipment?',
    answer: 'Yes, all our machines come with a 1-year manufacturer warranty and lifetime technical support from our certified team.'
  }
];
