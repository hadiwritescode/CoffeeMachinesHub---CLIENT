
import { NavLink, Product, BlogPost, FAQItem } from './types';

// Appending optimization parameters for production performance
const OPT = "&w=800&q=75&auto=format";
const THUMB = "&w=400&q=60&auto=format";

export const NAVIGATION_LINKS: NavLink[] = [
  { label: 'HOME', href: '/' },
  { 
    label: 'SHOP', 
    href: '/shop',
    subItems: [
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
        image: `https://images.unsplash.com/photo-1570197571499-166b36435e9f?${OPT}`,
        video: 'https://videos.pexels.com/video-files/3195979/3195979-uhd_2560_1440_25fps.mp4'
      },
      {
        title: 'Accessories',
        items: ['Barista Tools', 'Cleaning Supplies', 'Parts & Spares', 'Drinkware'],
        image: `https://images.unsplash.com/photo-1544655615-5654316d2e61?${OPT}`,
        video: 'https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4'
      }
    ]
  },
  { label: 'SERVICES', href: '/services' },
  { label: 'ABOUT', href: '/about' },
  { label: 'BLOGS', href: '/blogs' },
  { label: 'CONTACT', href: '/contact' },
];

export const TESTIMONIALS = [
  {
    name: "Ahmed Raza",
    role: "Café Owner",
    text: "The equipment from Coffee Machines Hub transformed our workflow. Their tech support is unmatched in Pakistan.",
    rating: 5
  },
  {
    name: "Sara Khan",
    role: "Home Barista",
    text: "Found the perfect espresso machine for my home. The guidance I received during the consultation was incredibly helpful.",
    rating: 5
  },
  {
    name: "Zeeshan Ali",
    role: "Hotel Manager",
    text: "Reliable commercial machines and prompt maintenance. They are our go-to partner for all things coffee.",
    rating: 5
  }
];

const STOCK_VIDEOS = {
  espresso: 'https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4',
  latte: 'https://videos.pexels.com/video-files/3195979/3195979-uhd_2560_1440_25fps.mp4',
  beans: 'https://videos.pexels.com/video-files/4828605/4828605-uhd_2560_1440_25fps.mp4',
  drip: 'https://videos.pexels.com/video-files/4442999/4442999-uhd_2560_1440_25fps.mp4',
  grind: 'https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4',
  slow: 'https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4'
};

export const BLENDS_PRODUCTS: Product[] = [
  {
    id: 'atlas',
    title: 'Atlas',
    price: 2775,
    image: `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?${OPT}`,
    hoverVideo: STOCK_VIDEOS.beans,
    subtitle: 'Dark Chocolate • Nutmeg • Spice',
    tags: ['Medium Roast', 'Blends'],
    category: 'Coffee', 
    description: 'Our signature blend designed for the bold.'
  },
  {
    id: 'wanderlust',
    title: 'Wanderlust',
    price: 3600,
    image: `https://images.unsplash.com/photo-1587049352851-8d4e89186eff?${OPT}`,
    hoverVideo: STOCK_VIDEOS.drip,
    subtitle: 'Hazelnut • Milk Chocolate • Citrus',
    tags: ['Medium Roast', 'Blends'],
    category: 'Coffee',
    description: 'A blend for the dreamer.'
  }
];

export const BEST_COFFEES: Product[] = [
  {
    id: 'pink-bourbon',
    title: 'Colombia Pink Bourbon',
    price: 4500,
    image: `https://images.unsplash.com/photo-1611854779393-1b2ae9be6017?${OPT}`,
    hoverVideo: STOCK_VIDEOS.slow,
    subtitle: 'Candy • Lychee • Pineapple',
    tags: ['Natural', 'Microlot', 'Organic', 'Single Origin'],
    origin: 'Aratoca, Santander',
    category: 'Coffee',
    description: 'A rare variety grown in the high altitudes of Santander.'
  }
];

export const GEAR_PRODUCTS: Product[] = [
  {
    id: 'aeropress-clear',
    title: 'Aeropress Clear',
    price: 18500,
    image: `https://images.unsplash.com/photo-1642649041280-3cb834c442b3?${OPT}`,
    hoverVideo: STOCK_VIDEOS.grind,
    soldOut: false,
    isFeatured: true,
    category: 'Accessories',
    tags: ['Barista Tools'],
    description: 'The iconic coffee press, now in crystal clear shatterproof Tritan.'
  },
  {
    id: 'hario-v60-copper',
    title: 'Hario V60 02 Copper',
    price: 22000,
    image: `https://images.unsplash.com/photo-1544655615-5654316d2e61?${OPT}`,
    soldOut: false,
    category: 'Accessories',
    tags: ['Barista Tools'],
    description: 'The premium copper version of the V60.'
  }
];

export const ALL_PRODUCTS = [...BLENDS_PRODUCTS, ...BEST_COFFEES, ...GEAR_PRODUCTS];

export const BRAND_LOGOS = [
  'Technivorm', 'Bialetti', 'Gaggia', 'La Marzocco', 'Fellow', 'Clever', 'PUQpress', 'AeroPress',
  'Toddy', 'Kalita', 'Mahlkonig', 'HeyCafe', 'Bodum', 'Baratza', 'Compak', 'Cafetto', 'Conti', 
  'Victoria Arduino', 'Timemore', 'Hario', 'Nuova Simonelli', 'Origami', 'Weber Workshops', 'Commandante'
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'origins',
    title: 'Origins: The Birthplace of Coffee',
    excerpt: 'Exploring the wild forests of Ethiopia...',
    date: 'October 12, 2025',
    image: `https://images.unsplash.com/photo-1629897103330-8b02446f2549?${OPT}`,
    author: 'Coffee Machines Hub',
    content: 'Ethiopia is widely considered the birthplace of coffee.'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Which coffee machine is best for my café?',
    answer: 'At Coffee Machines Hub, we begin with a free consultation...'
  }
];
