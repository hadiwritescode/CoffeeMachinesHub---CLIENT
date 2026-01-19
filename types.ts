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
  hoverImage?: string; 
  hoverVideo?: string; 
  category?: string;
  tags?: string[];
  soldOut?: boolean;
  subtitle?: string; 
  roastLevel?: string;
  origin?: string;
  description?: string;
  features?: Feature[];
}

export interface NavLink {
  label: string;
  href: string;
  subItems?: NavCategory[];
}

export interface NavCategory {
  title: string;
  items: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// --- NEW TYPES ---

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
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
  wishlist: string[]; // Product IDs
}

export interface TeamMember {
  name: string;
  role: string;
  img: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    videoUrl: string;
    buttonText: string;
  };
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  team: TeamMember[];
}