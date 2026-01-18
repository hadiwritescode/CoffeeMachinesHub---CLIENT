import { NavLink, Product, BlogPost, FAQItem } from './types';

export const NAVIGATION_LINKS: NavLink[] = [
  { label: 'HOME', href: '/' },
  { 
    label: 'SHOP', 
    href: '/shop',
    subItems: [
      {
        title: 'Coffee',
        items: ['Blends', 'Single Origin', 'Decaf', 'Exotic', 'Sample Packs']
      },
      {
        title: 'Brew Equipment',
        items: ['Brewers', 'Espresso Machines', 'Grinders', 'Kettles', 'Scales', 'Filters & Accessories']
      },
      {
        title: 'Merchandise',
        items: ['Apparel', 'Drinkware', 'Tote Bags']
      }
    ]
  },
  { label: 'SERVICES', href: '/services' },
  { label: 'ABOUT', href: '/about' },
  { label: 'BLOGS', href: '/blogs' },
  { label: 'CONTACT', href: '/contact' },
];

const STOCK_VIDEOS = {
  espresso: 'https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4',
  latte: 'https://videos.pexels.com/video-files/3195979/3195979-uhd_2560_1440_25fps.mp4',
  beans: 'https://videos.pexels.com/video-files/4828605/4828605-uhd_2560_1440_25fps.mp4',
  drip: 'https://videos.pexels.com/video-files/4442999/4442999-uhd_2560_1440_25fps.mp4',
  grind: 'https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4',
  slow: 'https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4'
};

// COFFEE PRODUCTS
export const BLENDS_PRODUCTS: Product[] = [
  {
    id: 'atlas',
    title: 'Nomad Atlas',
    price: 2775,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.beans,
    subtitle: 'Dark Chocolate • Nutmeg • Spice',
    tags: ['Medium Roast', 'Blends'],
    category: 'Coffee',
    description: 'Our signature blend designed for the bold. Atlas brings together beans from South America and Africa to create a complex profile of dark chocolate, warming spices, and a hint of dried fruit sweetness.'
  },
  {
    id: 'wanderlust',
    title: 'Nomad Wanderlust',
    price: 3600,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89186eff?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    subtitle: 'Hazelnut • Milk Chocolate • Citrus',
    tags: ['Medium Roast', 'Blends'],
    category: 'Coffee',
    description: 'A blend for the dreamer. Wanderlust combines the chocolate-rich comfort of Brazilian beans with the bright, floral sweetness of Ethiopian coffee. Perfect for a morning ritual.'
  },
  {
    id: 'mocha-java',
    title: 'Nomad Mocha Java',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.slow,
    subtitle: 'Tropical Fruit • Floral • Spiced Chocolate',
    tags: ['Light-Medium', 'Blends'],
    category: 'Coffee',
    description: 'The world’s oldest blend recipe, reimagined. Wild, fruity notes from Yemen mix with the deep, earthy body of Java to create a cup that is both historic and refreshingly modern.'
  },
  {
    id: 'odyssey',
    title: 'Nomad Odyssey',
    price: 3350,
    image: 'https://images.unsplash.com/photo-1559525839-8f897d5a363a?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.beans,
    subtitle: 'Spiced Plum • Cacao Nibs • Sweet Tobacco',
    tags: ['Medium-Dark', 'Blends'],
    category: 'Coffee',
    description: 'A journey into the dark side. Odyssey is our darkest roast, offering intense notes of spiced plum, bitter cacao nibs, and a finish reminiscent of sweet pipe tobacco.'
  },
  {
    id: 'zenith',
    title: 'Nomad Zenith',
    price: 2950,
    image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    subtitle: 'Crisp Apple • Caramel • Earl Grey',
    tags: ['Light Roast', 'Blends'],
    category: 'Coffee',
    description: 'Reach the peak of flavor. Zenith is a light roast blend focusing on high-altitude African beans, delivering a crisp acidity and a tea-like body.'
  },
  {
    id: 'equinox',
    title: 'Nomad Equinox',
    price: 3100,
    image: 'https://images.unsplash.com/photo-1621939514649-28b12e81d196?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.espresso,
    subtitle: 'Balanced • Nutty • Stone Fruit',
    tags: ['Medium Roast', 'Blends'],
    category: 'Coffee',
    description: 'Perfect balance for any season. Equinox balances the nutty sweetness of Central American coffees with the stone fruit acidity of Colombian beans.'
  },
  {
    id: 'meridian',
    title: 'Nomad Meridian Espresso',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.espresso,
    subtitle: 'Rich Crema • Dark Chocolate • Molasses',
    tags: ['Espresso', 'Blends'],
    category: 'Coffee',
    description: 'Designed for the espresso machine. Meridian produces a thick, rich crema with deep notes of dark chocolate and molasses. Excellent with milk.'
  },
  {
    id: 'night-owl-decaf',
    title: 'Night Owl Decaf',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&q=80&w=800',
    subtitle: 'Malt • Chocolate • Clean',
    tags: ['Decaf', 'Blends'],
    category: 'Coffee',
    description: 'Swiss Water Process decaf that doesn\'t compromise on flavor. Deep, malty sweetness with a clean finish. Sleep easy.'
  }
];

export const BEST_COFFEES: Product[] = [
  {
    id: 'pink-bourbon',
    title: 'Colombia Pink Bourbon',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2ae9be6017?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.slow,
    subtitle: 'Candy • Lychee • Pineapple',
    tags: ['Natural', 'Microlot', 'Organic', 'Single Origin'],
    origin: 'Aratoca, Santander',
    category: 'Coffee',
    description: 'A rare variety grown in the high altitudes of Santander. This Pink Bourbon undergoes a natural process that highlights its intense sweetness, reminiscent of cotton candy and tropical fruits.'
  },
  {
    id: 'yellow-fruit',
    title: 'Honey Yellow Fruit',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    subtitle: 'Passion Fruit • Condensed Milk • Dark Chocolate',
    tags: ['Honey', 'Quindio', 'Single Origin'],
    origin: 'Colombia, Quindio',
    category: 'Coffee',
    description: 'Processed using the Honey method, this coffee retains the mucilage during drying, resulting in a creamy body and notes of passion fruit and sweet condensed milk.'
  },
  {
    id: 'papayo',
    title: 'Colombia Papayo',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1629897103330-8b02446f2549?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.beans,
    subtitle: 'Strawberry • Candy • Tropical Fruit',
    tags: ['Natural', 'Microlot', 'Exotic', 'Single Origin'],
    origin: 'Quindio',
    category: 'Coffee',
    description: 'An exotic varietal known for its elongated beans and papaya-like shape. The cup profile is explosive, bursting with strawberry candy and mixed tropical fruit flavors.'
  },
  {
    id: 'geisha',
    title: 'Panama Geisha',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.slow,
    subtitle: 'Jasmine • Bergamot • Peach',
    tags: ['Washed', 'Exotic', 'Single Origin'],
    origin: 'Boquete',
    category: 'Coffee',
    description: 'The crown jewel of coffee. Our Panama Geisha is delicate and tea-like, offering elegant floral notes of jasmine and bergamot with a sweet peach finish.'
  },
  {
    id: 'ethiopia-guji',
    title: 'Ethiopia Guji',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1621939514649-28b12e81d196?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.latte,
    subtitle: 'Blueberry • Jasmine • Lemon',
    tags: ['Natural', 'Single Origin'],
    origin: 'Guji Zone, Ethiopia',
    category: 'Coffee',
    description: 'A classic Natural Ethiopian coffee. Bursting with blueberry jam notes and a distinct floral aroma.'
  },
  {
    id: 'kenya-aa',
    title: 'Kenya AA Plus',
    price: 4100,
    image: 'https://images.unsplash.com/photo-1559525839-8f897d5a363a?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    subtitle: 'Blackcurrant • Tomato • Savory',
    tags: ['Washed', 'Single Origin'],
    origin: 'Nyeri, Kenya',
    category: 'Coffee',
    description: 'Famous for its bright acidity and complex savory-sweet profile. Expect bold notes of blackcurrant and a juicy body.'
  },
  {
    id: 'costa-rica',
    title: 'Costa Rica Tarrazu',
    price: 3600,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89186eff?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.beans,
    subtitle: 'Honey • Citrus • Clean',
    tags: ['Washed', 'Single Origin'],
    origin: 'Tarrazu',
    category: 'Coffee',
    description: 'One of the world’s most pristine growing regions. This coffee is incredibly clean, with bright citrus acidity and a honey-like sweetness.'
  },
  {
    id: 'sumatra',
    title: 'Sumatra Mandheling',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.slow,
    subtitle: 'Earth • Spice • Tobacco',
    tags: ['Wet Hulled', 'Single Origin'],
    origin: 'Sumatra, Indonesia',
    category: 'Coffee',
    description: 'Low acidity, heavy body, and intense earthy flavors. The wet-hulling process gives it a distinct spicy and tobacco character.'
  },
   {
    id: 'burundi-kayanza',
    title: 'Burundi Kayanza',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1562447279-76077e231173?auto=format&fit=crop&q=80&w=800',
    subtitle: 'Red Currant • Tea • Brown Sugar',
    tags: ['Washed', 'Single Origin'],
    origin: 'Kayanza',
    category: 'Coffee',
    description: 'A hidden gem of Africa. This washed Burundi offers a vibrant acidity reminiscent of red currants with a lingering brown sugar sweetness.'
  },
  {
    id: 'guatemala-antigua',
    title: 'Guatemala Antigua',
    price: 3700,
    image: 'https://images.unsplash.com/photo-1511537632536-b74c276ecf00?auto=format&fit=crop&q=80&w=800',
    subtitle: 'Cocoa • Spice • Smoke',
    tags: ['Washed', 'Single Origin'],
    origin: 'Antigua',
    category: 'Coffee',
    description: 'Grown in volcanic soil, this coffee is known for its full body, rich chocolate notes, and a hint of smoky spice.'
  }
];

// GEAR PRODUCTS
export const GEAR_PRODUCTS: Product[] = [
  {
    id: 'aeropress-clear',
    title: 'Aeropress Clear',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1642649041280-3cb834c442b3?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.grind,
    soldOut: false,
    category: 'Gear',
    tags: ['Brewers', 'Aeropress'],
    description: 'The iconic coffee press, now in crystal clear shatterproof Tritan. Make delicious American, espresso, and cold brew style coffee.'
  },
  {
    id: 'hario-v60-copper',
    title: 'Hario V60 02 Copper',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1544655615-5654316d2e61?auto=format&fit=crop&q=80&w=800',
    soldOut: false,
    category: 'Gear',
    tags: ['Brewers', 'Pour Over'],
    description: 'The premium copper version of the V60 not only looks stunning but offers superior thermal conductivity for better extraction control.'
  },
  {
    id: 'chemex-6',
    title: 'Chemex Classic 6-Cup',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1595928642581-f50f4f345668?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    soldOut: false,
    category: 'Gear',
    tags: ['Brewers', 'Pour Over'],
    description: 'An elegant, one-piece, hourglass shaped vessel made of high quality, heat resistant glass. Delivers the purest flavor experience.'
  },
  {
    id: 'stagg-kettle-matte-black',
    title: 'Fellow Stagg EKG Kettle',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1565458189033-93666eb9f388?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    soldOut: false,
    category: 'Gear',
    tags: ['Kettles', 'Brewers'],
    description: 'The electric pour-over kettle for coffee lovers. Variable temperature control, 1200 watts for a quick heat time, and a world of features for ultimate control.'
  },
  {
    id: 'baratza-encore-esp',
    title: 'Baratza Encore ESP',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1618116523910-1840b2f69830?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.grind,
    soldOut: false,
    category: 'Gear',
    tags: ['Grinders', 'Brewers'],
    description: 'Optimized for espresso but capable of brewing anything. The new standard for entry-level home grinding.'
  },
  {
    id: 'acaia-pearl',
    title: 'Acaia Pearl Scale S',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1613529328577-49527f31c26b?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.grind,
    soldOut: false,
    category: 'Gear',
    tags: ['Scales', 'Tools'],
    description: 'The professional grade smart scale. Real-time flow-rate indicator and optimized modes for espresso and pour-over.'
  },
  {
    id: 'origami-dripper-s',
    title: 'Origami Dripper S',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800',
    hoverVideo: STOCK_VIDEOS.drip,
    soldOut: false,
    category: 'Gear',
    tags: ['Brewers', 'Pour Over'],
    description: 'Designed by the founder of Trunk Coffee in Japan, this dripper features 20 ribs that create air channels for a smooth brew.'
  },
  {
    id: 'fellow-ode',
    title: 'Fellow Ode Gen 2',
    price: 98000,
    image: 'https://images.unsplash.com/photo-1595514013142-3e3c0d291e60?auto=format&fit=crop&q=80&w=800',
    soldOut: true,
    category: 'Gear',
    tags: ['Grinders', 'Brewers'],
    description: 'A powerful, precise, and quieter home coffee grinder with café capabilities. Specifically designed to perfect your daily brewed coffee.'
  },
  {
    id: 'kalita-wave',
    title: 'Kalita Wave 185 Stainless',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1563293815-58721c812d1c?auto=format&fit=crop&q=80&w=800',
    category: 'Gear',
    tags: ['Brewers', 'Pour Over'],
    description: 'The flat-bottom geometry facilitates an even extraction that makes brewing a perfect cup accessible and consistent.'
  },
  {
    id: 'flair-58',
    title: 'Flair 58 Espresso Maker',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800',
    category: 'Gear',
    tags: ['Brewers', 'Espresso'],
    description: 'A fully manual, professional grade lever espresso press. Features a heated brew head and standard 58mm portafilter for cafe-quality shots at home.'
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
    excerpt: 'Exploring the wild forests of Ethiopia where Arabica coffee was first discovered.',
    date: 'October 12, 2025',
    image: 'https://images.unsplash.com/photo-1629897103330-8b02446f2549?auto=format&fit=crop&q=80&w=800',
    author: 'Nomad Team',
    content: 'Ethiopia is widely considered the birthplace of coffee (Coffea arabica). The story goes that a goat herder named Kaldi noticed his goats dancing after eating red cherries from a shrub. He tried them himself and felt the same energy. Today, Ethiopia produces some of the most distinct coffees in the world, known for their floral, tea-like, and fruity characteristics.'
  },
  {
    id: 'brewing-v60',
    title: 'Mastering the V60 Pour Over',
    excerpt: 'A comprehensive guide to getting the best extraction from your Hario V60.',
    date: 'September 28, 2025',
    image: 'https://images.unsplash.com/photo-1521494794829-d59663d19854?auto=format&fit=crop&q=80&w=800',
    author: 'Head Barista',
    content: 'The V60 is deceptively simple. A cone, a paper filter, and hot water. But the variables—grind size, water temperature, pour rate—can drastically change the cup. Start with a 1:16 ratio (15g coffee to 240g water). Bloom for 45 seconds, then pour in slow concentric circles. Aim for a total brew time of 2:30 to 3:00 minutes.'
  },
  {
    id: 'roasting-profiles',
    title: 'Understanding Roast Profiles',
    excerpt: 'Light, Medium, or Dark? How roasting changes the flavor of your bean.',
    date: 'September 15, 2025',
    image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?auto=format&fit=crop&q=80&w=800',
    author: 'Roaster',
    content: 'Roasting is the heat process that turns green coffee into the brown beans we know. Light roasts preserve the origin characteristics of the bean (acidity, fruitiness). Dark roasts replace those origin notes with roast flavors (smoke, chocolate, body). Medium roasts try to balance both.'
  },
  {
    id: 'grinder-importance',
    title: 'Why Your Grinder Matters More Than Your Machine',
    excerpt: 'The secret to better coffee isn\'t a more expensive machine—it\'s a better grinder.',
    date: 'August 10, 2025',
    image: 'https://images.unsplash.com/photo-1618116523910-1840b2f69830?auto=format&fit=crop&q=80&w=800',
    author: 'Tech Lead',
    content: 'Consistent particle size is key to even extraction. Blade grinders chop beans unevenly, leading to both sour and bitter flavors in the same cup. A burr grinder ensures uniformity, unlocking clarity and sweetness you never knew existed in your beans.'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How long does shipping take?',
    answer: 'We ship nationwide via TCS/Leopards. Orders placed before 2 PM usually ship the same day. Delivery typically takes 2-4 business days depending on your city.'
  },
  {
    question: 'Do you grind coffee for customers?',
    answer: 'Yes! Just leave a note at checkout specifying your brew method (e.g., French Press, Espresso, Pour Over), and we will grind it fresh before shipping.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns on gear and merchandise within 14 days if unused and in original packaging. Coffee beans cannot be returned due to their perishable nature, but if there is an issue with quality, please contact us.'
  },
  {
    question: 'Do you offer wholesale pricing?',
    answer: 'Yes, we partner with cafes, offices, and restaurants. Please visit our Services page to get in touch with our wholesale team.'
  },
  {
    question: 'Are your bags recyclable?',
    answer: 'Our current bags are lined to ensure freshness, making them difficult to recycle in standard streams. However, we are actively transitioning to a fully compostable solution by 2026.'
  }
];