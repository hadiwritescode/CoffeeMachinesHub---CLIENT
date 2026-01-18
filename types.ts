export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  hoverImage?: string; // Image to show on hover
  hoverVideo?: string; // Video to show on hover
  category?: string;
  tags?: string[];
  soldOut?: boolean;
  subtitle?: string; // For things like "Candy • Lychee • Pineapple"
  roastLevel?: string;
  origin?: string;
  description?: string;
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