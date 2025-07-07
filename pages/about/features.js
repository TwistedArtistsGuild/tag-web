/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import FAQ from '/components/FAQ';

// Features Page - Showcasing platform's core functionalities
const Features = () => {
  // Features data with sections and details
  const featureSections = [
    {
      id: 'artist-showcase',
      title: 'Artist Showcase & Community',
      description: 'Independent artists can showcase their work, manage portfolios, and connect with art lovers in an ad-free environment.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/art-gallery.jpg',
      features: [
        'Portfolio management with customizable galleries',
        'Direct messaging system between artists and collectors',
        'Community forums for artistic collaboration',
        'Ad-free browsing experience for authentic art appreciation'
      ]
    },
    {
      id: 'event-management',
      title: 'Event Hosting & Promotion',
      description: 'Event hosts benefit from streamlined ticketing and promotion tools designed specifically for creative events.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/event-promotion.jpg',
      features: [
        'Integrated ticketing system with QR code functionality',
        'Automated event promotion across social channels',
        'Analytics dashboard for attendance tracking',
        'Custom event pages with multimedia support'
      ]
    },
    {
      id: 'business-tools',
      title: 'Creative Business Tools',
      description: 'Comprehensive suite of business tools tailored for creative entrepreneurs and independent artists.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/business-tools.jpg',
      features: [
        'Secure payment processing with multiple currency support',
        'Expense tracking and financial reporting',
        'Customer relationship management system',
        'Inventory management for physical artwork and merchandise'
      ]
    },
    {
      id: 'fintech-integration',
      title: 'Fintech Solutions',
      description: 'Seamless financial technology integration that respects your business while ensuring security and compliance.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/fintech-secure.jpg',
      features: [
        'End-to-end encrypted transactions',
        'Automated sales tax calculation and reporting',
        'Subscription and recurring payment options',
        'Integrated invoicing system with customizable templates'
      ]
    },
    {
      id: 'social-media',
      title: 'Social Media for Art',
      description: 'A dedicated platform for art lovers to like, comment, and share art without intrusive advertisements.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/social-media.jpg',
      features: [
        'Ad-free browsing experience',
        'Direct and group messaging systems',
        'Report concerns and commendations to a moderation committee',
        'Participate in art competitions with public voting'
      ]
    },
    {
      id: 'anti-scalping',
      title: 'Anti-Scalping Event Features',
      description: 'Ensuring fair ticketing practices for art events.',
      image: 'https://tagpictures.blob.core.windows.net/twistedpassions/anti-scalping.jpg',
      features: [
        'Full refunds up to a configurable time window',
        'FIFO waitlist queue for ticket redistribution',
        'Tickets not sold above face value',
        'Secure third-party ticket transfers'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Features | Our Creative Platform</title>
        <meta name="description" content="Discover the powerful features of our platform designed for artists, event hosts, and creative entrepreneurs." />
      </Head>

      {/* Hero Section */}
      <div className="hero py-16 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Platform Features</h1>
            <p className="text-xl mb-8">
              Our platform seamlessly blends art, ecommerce, social media, and fintech into one immersive experience. 
              Designed for a vibrant, progressive community, we empower you to share, sell, and succeed in an 
              environment that respects creativity and innovation every step of the way.
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-outline">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Sections */}
      <div className="container mx-auto px-4 py-12">
        {featureSections.map((section, index) => (
          <div 
            key={section.id}
            className={`flex flex-col ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } gap-8 mb-24 items-center`}
          >
            {/* Image Section */}
            <div className="md:w-1/2 relative">
              <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src={section.image} 
                  alt={section.title}
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-3xl mb-4">{section.title}</h2>
                  <p className="mb-6 text-lg">{section.description}</p>
                  <ul className="space-y-3">
                    {section.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="bg-primary text-primary-content py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Creative Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of artists, event hosts, and entrepreneurs who are already leveraging 
            our platform to grow their creative businesses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-secondary btn-lg">Sign Up Now</button>
            <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials/Stats Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Creators Choose Us</h2>
          
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Active Artists</div>
              <div className="stat-value text-primary">25K+</div>
              <div className="stat-desc">Growing 12% month-over-month</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">Monthly Transactions</div>
              <div className="stat-value text-secondary">$2.4M</div>
              <div className="stat-desc">↗︎ 340 (22%)</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </div>
              <div className="stat-title">Annual Events</div>
              <div className="stat-value">12.6K</div>
              <div className="stat-desc">↗︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

    </div>
  );
};

export default Features;