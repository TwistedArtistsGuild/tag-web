/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

/**
 * NeonArtCard - A component that displays artwork with neon styling
 * 
 * @param {Object} props Component properties
 * @param {Object} props.artwork The artwork data to display
 * @returns {React.ReactElement} A styled art card with neon effects
 */
const NeonArtCard = ({ artwork }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Randomly assign a neon glow effect color to each card for visual interest
  const neonEffects = ['neon-glow-green', 'neon-glow-pink', 'neon-glow-purple'];
  const randomEffect = neonEffects[Math.floor(Math.random() * neonEffects.length)];
  
  return (
    <div 
      className={`card-tag relative rounded-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Art Image */}
      <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          fetchpriority="high"
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Price tag with neon effect if artwork has price */}
        {artwork.price && (
          <div className={`absolute top-3 right-3 bg-[#121212] px-3 py-1 rounded-full font-bold z-10 ${randomEffect}`}>
            ${artwork.price.toLocaleString()}
          </div>
        )}
      </div>
      
      {/* Artwork Details */}
      <div className="p-4">
        <h3 className={`text-xl font-bold mb-1 ${isHovered ? randomEffect : ''}`}>
          {artwork.title}
        </h3>
        
        <p className="text-sm mb-3">by {artwork.artistName}</p>
        
        <p className="text-sm mb-3 line-clamp-2 opacity-80">
          {artwork.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {artwork.tags && artwork.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-[#27272A] px-2 py-1 rounded hover:bg-[#3F3F46] transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto">
          <button className={`btn-tag-neon text-sm px-3 py-1 rounded ${isHovered ? 'neon-glow-pink' : ''}`}>
            View Details
          </button>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#27272A] hover:bg-[#FF10F0] transition-colors"
            aria-label="Add to favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Neon bottom border that expands on hover */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-500 ${isHovered ? 'h-2' : 'h-1'}`}
        style={{
          background: `linear-gradient(90deg, var(--tag-primary), var(--tag-secondary), var(--tag-accent))`,
          boxShadow: isHovered ? '0 0 10px var(--tag-secondary), 0 0 15px var(--tag-accent)' : 'none'
        }}
      >
      </div>
    </div>
  );
};

/**
 * NeonTestimonial - Displays user testimonials with neon styling
 * 
 * @param {Object} props Component properties
 * @param {Object} props.testimonial The testimonial data to display
 * @returns {React.ReactElement} A styled testimonial card with neon accents
 */
const NeonTestimonial = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="card-tag p-6 relative">
      {/* Testimonial content */}
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={testimonial.avatarUrl} 
            alt={testimonial.name}
            fill
            fetchpriority="high"
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-bold neon-glow-purple mb-1">{testimonial.name}</h4>
          <p className="text-sm opacity-70 mb-3">{testimonial.role}</p>
          
          <div className="relative">
            <p className={`text-sm ${!isExpanded ? 'line-clamp-3' : ''}`}>
              &quot;{testimonial.content}&quot;
            </p>
            
            {testimonial.content.length > 180 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs neon-glow-pink mt-2 cursor-pointer"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Rating stars */}
      <div className="flex mt-4 justify-end">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      {/* Accent border */}
      <div 
        className="absolute top-0 left-0 w-2 h-full" 
        style={{
          background: 'linear-gradient(180deg, var(--tag-primary), var(--tag-accent))',
          boxShadow: '0 0 8px var(--tag-accent)'
        }}
      ></div>
    </div>
  );
};

/**
 * NeonFeatureItem - Displays individual feature items with neon accents
 * 
 * @param {Object} props Component properties
 * @param {Object} props.feature The feature to display
 * @returns {React.ReactElement} A styled feature item
 */
const NeonFeatureItem = ({ feature }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center hover:bg-[#1A1A1A] transition-colors rounded-lg">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: 'linear-gradient(135deg, var(--tag-primary), var(--tag-accent))',
          boxShadow: '0 0 15px var(--tag-accent)'
        }}
      >
        <span className="text-2xl">{feature.icon}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-3 neon-glow-green">{feature.title}</h3>
      
      <p className="text-sm opacity-80">
        {feature.description}
      </p>
    </div>
  );
};

/**
 * NeonArtistCard - Displays featured artists with neon styling
 * 
 * @param {Object} props Component properties
 * @param {Object} props.artist The artist data to display
 * @returns {React.ReactElement} A styled artist card with neon effects
 */
const NeonArtistCard = ({ artist }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Artist image with overlay gradient */}
      <div className="relative h-80 w-full">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          fetchpriority="high"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-80 transition-opacity"
        ></div>
      </div>
      
      {/* Artist info */}
      <div className="absolute bottom-0 left-0 w-full p-5">
        <h3 className="text-2xl font-bold mb-1 neon-glow-purple group-hover:neon-glow-green transition-all duration-300">
          {artist.name}
        </h3>
        
        <p className="text-sm mb-3 opacity-90">
          {artist.specialty}
        </p>
        
        {/* Social media links */}
        <div className="flex gap-3">
          {artist.socialLinks && artist.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#27272A] hover:bg-[#FF10F0] transition-colors"
              aria-label={link.platform}
            >
              <span>{link.icon}</span>
            </a>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-3">
          <div>
            <span className="text-xs opacity-70">Artworks</span>
            <p className="font-bold">{artist.artworkCount}</p>
          </div>
          <div>
            <span className="text-xs opacity-70">Followers</span>
            <p className="font-bold">{artist.followers}</p>
          </div>
        </div>
      </div>
      
      {/* Featured badge if applicable */}
      {artist.featured && (
        <div 
          className="absolute top-3 left-0 bg-black px-3 py-1 neon-glow-pink"
          style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}
        >
          Featured
        </div>
      )}
    </div>
  );
};

/**
 * NeonInfoBlock - Displays information blocks with neon styling
 * 
 * @param {Object} props Component properties
 * @param {Object} props.info The information to display
 * @returns {React.ReactElement} A styled information block
 */
const NeonInfoBlock = ({ info }) => {
  return (
    <div 
      className="relative p-6 rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(45deg, rgba(10,10,10,0.9), rgba(30,30,30,0.9))',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <h3 className={`text-xl font-bold mb-4 ${info.glowClass}`}>
        {info.title}
      </h3>
      
      <p className="mb-4 text-sm leading-relaxed opacity-80">
        {info.content}
      </p>
      
      {info.list && (
        <ul className="space-y-2 mb-6">
          {info.list.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className={info.glowClass}>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      
      {info.ctaText && (
        <Link href={info.ctaLink || '#'} legacyBehavior>
          <a className={`inline-block px-4 py-2 rounded ${info.glowClass} border border-current`}>
            {info.ctaText}
          </a>
        </Link>
      )}
      
      {/* Decorative element */}
      <div 
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20" 
        style={{ 
          background: 'radial-gradient(circle, var(--tag-accent), transparent 70%)'
        }}
      ></div>
    </div>
  );
};

/**
 * NeonTest - A test page for showcasing neon-themed art cards
 * This page is intentionally long to test footer positioning behavior
 * Uses client-side hydration safety patterns to prevent React mismatch errors
 * 
 * @returns {React.ReactElement} Test page with art cards using neon styling
 */
export default function NeonTest() {
  // State to track scroll position and page dimensions
  const [scrollPosition, setScrollPosition] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  // Flag to prevent hydration mismatches by only showing certain elements client-side
  const [isMounted, setIsMounted] = useState(false);
  
  // Track scroll position and page height for debugging
  useEffect(() => {
    // Set isMounted to true once we're on the client side
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    const updatePageHeight = () => {
      const body = document.body;
      const html = document.documentElement;
      
      // Get the maximum height of the page
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      
      setPageHeight(height);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updatePageHeight);
    
    // Initial measurement
    setTimeout(updatePageHeight, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePageHeight);
    };
  }, []);
  
  // Mock artwork data for displaying test cards
  const mockArtworks = [
    {
      id: '1',
      title: 'Electric Dreams',
      artistName: 'Neon Nova',
      imageUrl: 'https://images.unsplash.com/photo-1580481058966-717fc10b5c6a?ixlib=rb-4.0.3',
      description: 'A vibrant exploration of consciousness in the digital age, featuring bold colors and abstract forms.',
      price: 2500,
      tags: ['digital', 'abstract', 'neon']
    },
    {
      id: '2',
      title: 'Cyber Dawn',
      artistName: 'Pixel Prophet',
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3',
      description: 'Futuristic cityscape at dawn, where technology and nature meet in harmonious balance.',
      price: 1800,
      tags: ['cyberpunk', 'landscape', 'futurism']
    },
    {
      id: '3',
      title: 'Quantum Fragments',
      artistName: 'Glitch Goddess',
      imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3',
      description: 'Fragments of reality shattered across dimensions, a meditation on quantum physics and perception.',
      price: 3200,
      tags: ['glitch', 'quantum', 'experimental']
    },
    {
      id: '4',
      title: 'Neon Jungle',
      artistName: 'Synthwave Samurai',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3',
      description: 'Tropical flora reimagined with vibrant neon colors, a collision of nature and artificial light.',
      price: 1950,
      tags: ['tropical', 'synthwave', 'glow']
    },
    {
      id: '5',
      title: 'Digital Wasteland',
      artistName: 'Binary Bandit',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3',
      description: 'Post-apocalyptic digital landscape where abandoned data structures create haunting silhouettes.',
      price: 2750,
      tags: ['digital', 'dystopian', 'conceptual']
    },
    {
      id: '6',
      title: 'Holographic Heart',
      artistName: 'Digital Dreamer',
      imageUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3',
      description: 'An exploration of emotion in the digital age, represented through prismatic light and holographic textures.',
      price: 2200,
      tags: ['holographic', 'emotional', 'light']
    },
    {
      id: '7',
      title: 'Spectral Echoes',
      artistName: 'Void Visionary',
      imageUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3',
      description: 'Sound waves visualized as spectral forms, capturing the ephemeral nature of auditory experience.',
      price: 1875,
      tags: ['soundwave', 'spectrum', 'audio']
    },
    {
      id: '8',
      title: 'Circuit Dreams',
      artistName: 'Tech Shaman',
      imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3',
      description: 'Intricate patterns inspired by circuit boards and neural networks, rendered in luminescent blues and purples.',
      price: 3400,
      tags: ['circuit', 'tech', 'pattern']
    }
  ];
  
  // Mock testimonial data
  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Art Collector',
      content: 'The neon aesthetic of these artworks completely transformed my living space. The vibrant colors and bold designs bring so much energy into the room, it\'s like having a portal to another dimension right on my wall. Absolutely worth every penny!',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3'
    },
    {
      name: 'Samantha Chen',
      role: 'Interior Designer',
      content: 'As someone who works with spaces professionally, I\'m always looking for statement pieces that can anchor a room. These neon-inspired works are perfect for clients who want something bold yet sophisticated. The glow effect creates amazing ambiance, especially in evening lighting.',
      rating: 4,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3'
    },
    {
      name: 'Marcus Johnson',
      role: 'Tech Entrepreneur',
      content: 'I\'ve decorated my entire office with these cyberpunk-inspired pieces. The futuristic aesthetic perfectly complements our company\'s forward-thinking philosophy. Visitors are always impressed by how the art influences the overall mood of our workspace.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3'
    }
  ];
  
  // Mock features data
  const features = [
    {
      icon: '🎨',
      title: 'Vibrant Palettes',
      description: 'Our neon art features carefully selected color palettes that ensure optimal visual impact and harmony.'
    },
    {
      icon: '✨',
      title: 'Glow Effects',
      description: 'Special materials and techniques create authentic glow effects that transform spaces day and night.'
    },
    {
      icon: '🔌',
      title: 'Energy Efficient',
      description: 'Modern LED technology means our neon art consumes minimal electricity while maximizing visual impact.'
    },
    {
      icon: '🛠️',
      title: 'Custom Designs',
      description: 'Work with our artists to create personalized neon artwork tailored to your specific vision and space.'
    }
  ];
  
  // Mock featured artists
  const featuredArtists = [
    {
      name: 'Luna Bright',
      specialty: 'Digital Neon Landscapes',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3',
      featured: true,
      artworkCount: 24,
      followers: '5.2K',
      socialLinks: [
        { platform: 'Instagram', icon: 'IG', url: '#' },
        { platform: 'Twitter', icon: 'TW', url: '#' }
      ]
    },
    {
      name: 'Rex Voltage',
      specialty: 'Cyberpunk Portraits',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3',
      featured: false,
      artworkCount: 17,
      followers: '3.8K',
      socialLinks: [
        { platform: 'Instagram', icon: 'IG', url: '#' },
        { platform: 'Twitter', icon: 'TW', url: '#' }
      ]
    },
    {
      name: 'Nova Light',
      specialty: 'Abstract Neon Sculptures',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3',
      featured: true,
      artworkCount: 31,
      followers: '7.5K',
      socialLinks: [
        { platform: 'Instagram', icon: 'IG', url: '#' },
        { platform: 'Twitter', icon: 'TW', url: '#' }
      ]
    },
    {
      name: 'Pixel Storm',
      specialty: 'Glitch Art & Vaporwave',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      featured: false,
      artworkCount: 19,
      followers: '4.3K',
      socialLinks: [
        { platform: 'Instagram', icon: 'IG', url: '#' },
        { platform: 'Twitter', icon: 'TW', url: '#' }
      ]
    }
  ];
  
  // Mock info blocks
  const infoBlocks = [
    {
      title: 'About Neon Art',
      content: 'Neon art combines traditional artistic principles with cutting-edge lighting technology. This fusion creates pieces that are both visually striking and emotionally resonant, transforming spaces through color and light.',
      glowClass: 'neon-glow-green',
      list: [
        'Handcrafted with premium materials',
        'Energy-efficient LED technology',
        'Custom designs available',
        'Indoor and outdoor options'
      ],
      ctaText: 'Learn More',
      ctaLink: '/about'
    },
    {
      title: 'Join Our Community',
      content: 'Connect with fellow neon art enthusiasts, get exclusive previews of upcoming collections, and participate in virtual gallery tours and artist Q&A sessions.',
      glowClass: 'neon-glow-pink',
      list: [
        'Monthly virtual exhibitions',
        'Direct artist interactions',
        'Early access to new releases',
        'Special member pricing'
      ],
      ctaText: 'Sign Up',
      ctaLink: '/signup'
    }
  ];

  return (
    <div className="tag-body min-h-screen p-8 font-sans">
      <Head>
        <title>Neon Art Gallery Test | TAG</title>
      </Head>
      
      <header className="header-paint-drip mb-12 py-8 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">
          <span className="neon-glow-green">Neon</span>{' '}
          <span className="neon-glow-pink">Art</span>{' '}
          <span className="neon-glow-purple">Gallery</span>
        </h1>
        <p className="text-xl opacity-80">Testing our new vibrant neon theme with extra long content</p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        {/* Hero Section with Call-to-Action */}
        <section className="relative h-[500px] rounded-2xl overflow-hidden mb-16 flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3"
            alt="Neon Art Gallery"
            fill
            fetchpriority="high"
            style={{ objectFit: 'cover' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <h2 className="text-5xl font-bold mb-4 neon-glow-green">Illuminate Your Space</h2>
            <p className="text-xl mb-8">Discover extraordinary neon artwork that transforms environments and captivates the imagination.</p>
            <div className="flex gap-4 justify-center">
              <button className="btn-tag-gradient px-6 py-3 rounded-lg text-lg">
                Explore Collection
              </button>
              <button className="btn-tag-neon px-6 py-3 rounded-lg text-lg">
                Learn More
              </button>
            </div>
          </div>
        </section>
        
        {/* Controls for demonstration */}
        <section className="mb-16">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold neon-glow-pink">Featured Artworks</h2>
            
            <div className="flex gap-4">
              <button className="btn-tag-neon px-4 py-2 rounded">
                Filter
              </button>
              <button className="btn-tag-gradient px-4 py-2 rounded">
                Create New
              </button>
            </div>
          </div>
          
          {/* Art Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockArtworks.map(artwork => (
              <NeonArtCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
        
        {/* Featured Artists Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 neon-glow-purple">Featured Artists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist, index) => (
              <NeonArtistCard key={index} artist={artist} />
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold neon-glow-green mb-4">Why Choose Neon Art</h2>
            <p className="max-w-2xl mx-auto opacity-80">
              Our neon artworks combine cutting-edge technology with artistic vision to create pieces that transform spaces.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <NeonFeatureItem key={index} feature={feature} />
            ))}
          </div>
        </section>
        
        {/* Info Blocks Section */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {infoBlocks.map((info, index) => (
            <NeonInfoBlock key={index} info={info} />
          ))}
        </section>
        
        {/* Call to Action Banner */}
        <section 
          className="mb-16 rounded-lg p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #080808 0%, #1c1c1c 100%)',
          }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 neon-glow-pink">Ready to Transform Your Space?</h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-80">
              Explore our collection of neon artworks or commission a custom piece that speaks to your unique style.
            </p>
            <button className="btn-tag-gradient px-8 py-3 rounded-lg text-lg">
              Get Started Today
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div 
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" 
              style={{ background: 'radial-gradient(circle, var(--tag-primary), transparent 70%)' }}
            ></div>
            <div 
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20" 
              style={{ background: 'radial-gradient(circle, var(--tag-accent), transparent 70%)' }}
            ></div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 neon-glow-green">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <NeonTestimonial key={index} testimonial={testimonial} />
            ))}
          </div>
        </section>
        
        {/* Additional UI elements to showcase theme */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 neon-glow-green">Theme Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-tag p-6">
              <h3 className="text-xl font-bold mb-4 neon-glow-purple">Form Elements</h3>
              
              <div className="mb-4">
                <label className="block mb-2">Input Field</label>
                <input 
                  type="text" 
                  className="input-tag w-full"
                  placeholder="Enter text here" 
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Select Dropdown</label>
                <select className="select-tag w-full">
                  <option value="">Select an option</option>
                  <option value="1">Option One</option>
                  <option value="2">Option Two</option>
                  <option value="3">Option Three</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button className="btn-tag-neon px-4 py-2 rounded">
                  Cancel
                </button>
                <button className="btn-tag-gradient px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </div>
            
            <div className="card-tag p-6">
              <h3 className="text-xl font-bold mb-4 neon-glow-green">Links & Dividers</h3>
              
              <p className="mb-4">
                Navigate to <Link href="/gallery" legacyBehavior><a className="link-tag">Gallery</a></Link> or 
                view <Link href="/artists" legacyBehavior><a className="link-tag">Artists</a></Link> for more artwork.
              </p>
              
              <hr className="neon-divider my-6" />
              
              <p>
                The neon theme provides visual cues for interactive elements while maintaining readability and accessibility.
              </p>
            </div>
          </div>
        </section>
        
        {/* Extra Content for Scrolling */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 neon-glow-pink">Additional Content for Scroll Testing</h2>
          
          <div className="card-tag p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">About Neon Art History</h3>
            
            <p className="mb-4">
              Neon art first emerged in the early 20th century when neon lighting was invented by Georges Claude in 1910. 
              While initially used for commercial signage, artists quickly recognized the creative potential of this medium that could 
              literally paint with light.
            </p>
            
            <p className="mb-4">
              The 1960s saw a renaissance in neon art, with pioneering artists like Dan Flavin and Bruce Nauman incorporating 
              light elements into sculptural works. The medium&apos;s association with urban landscapes, advertising, and nightlife 
              made it a powerful tool for commentary on modern life and consumerism.
            </p>
            
            <p className="mb-4">
              Today&apos;s neon artists blend traditional glass-bending techniques with modern LED technology and digital controls, 
              creating works that can shift in color and intensity, respond to viewers, or sync with music and environmental factors.
            </p>
            
            <p>
              The resurgence of interest in neon aesthetics within contemporary art reflects both nostalgia for 20th century 
              urban landscapes and a forward-looking embrace of technology&apos;s role in artistic expression.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card-tag p-6">
                <h3 className="text-lg font-bold mb-3 neon-glow-green">Neon Art Technique #{item}</h3>
                
                <p className="text-sm opacity-80 mb-4">
                  Contemporary neon artists employ various techniques to create stunning visual effects, combining traditional 
                  craftsmanship with cutting-edge technology.
                </p>
                
                <button className="btn-tag-neon w-full py-2 rounded">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className="mb-16 card-tag p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold neon-glow-pink mb-2">Stay Illuminated</h2>
            <p className="opacity-80">Subscribe to our newsletter for exclusive updates and special offers</p>
          </div>
          
          <div className="flex max-w-lg mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-tag flex-1" 
            />
            <button className="btn-tag-gradient px-6 py-2 rounded whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>
        
        {/* Footer Debug Section */}
        <section className="mb-16 card-tag p-6">
          <h2 className="text-xl font-bold mb-4 neon-glow-purple">Page Info</h2>
          
          <p className="mb-2">
            This extra-long page demonstrates proper content flow with correct footer positioning.
          </p>
          
          {isMounted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-black/30 rounded">
                <strong className="block mb-1 text-sm">Current Page Height:</strong>
                <span className="text-green-400">{pageHeight}px</span>
              </div>
              
              <div className="p-3 bg-black/30 rounded">
                <strong className="block mb-1 text-sm">Current Viewport Height:</strong>
                <span className="text-green-400">{windowHeight}px</span>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-black/30 rounded mb-4">
            <strong className="block mb-1 text-sm">Expected Footer Behavior:</strong>
            <p className="text-sm">The footer should sit directly at the bottom of content, not fixed to viewport.</p>
          </div>
        </section>
      </main>
      
      <footer className="mt-16 text-center opacity-70">
        <p>© {new Date().getFullYear()} TAG - Twisted Artisan Gallery</p>
      </footer>
    </div>
  );
}