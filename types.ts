
export interface Feature {
  title: string;
  content: string;
  icon: 'flame' | 'map' | 'droplet' | 'coffee' | 'shield' | 'settings' | 'award' | 'cpu' | 'wifi' | 'layers' | 'thermometer' | 'box';
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  images?: string[]; 
  hoverImage?: string; 
  hoverVideo?: string; 
  category?: string;
  tags?: string[];
  soldOut?: boolean;
  isFeatured?: boolean; 
  subtitle?: string; 
  roastLevel?: string;
  origin?: string;
  description?: string;
  features?: Feature[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NavLink {
  label: string;
  href: string;
  subItems?: NavCategory[];
}

export interface NavCategory {
  title: string;
  items: string[];
  image?: string;
  video?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
  sourceLink?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CoreValue {
  title: string;
  text: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  wishlist: string[]; 
  cart?: CartItem[]; // Persistent Cart
  phone?: string;
  address?: string;
  city?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  img: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface Message {
  id: string;
  date: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    videoUrl: string;
    buttonText: string;
  };
  home: {
    brands: string[];
    collectionTitle: string;
    collectionSubtitle: string;
    featuredTitle: string;
    favoritesTitle: string;
    favoritesSubtitle: string;
    partnersText: string;
    marqueeText: string;
    trendingTags: string[];
  };
  shop: {
    heroTitle: string;
    heroSubtitle: string;
  };
  services: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    section1Title: string;
    section1Text: string;
    section1List?: string[]; 
    section1Image: string;
    section2Title: string;
    section2Text: string;
    section2Image: string;
    section3Title: string;
    section3Text: string;
    section3Image: string;
  };
  about: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    storyTitle: string;
    storyText: string;
    values: CoreValue[];
  };
  contact: {
    address: string;
    email: string;
    phone: string;
    faqs: FAQItem[];
  };
  footer: {
    description: string;
    companyLinks: LinkItem[];
    legalLinks: LinkItem[];
  };
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  team: TeamMember[];
}
