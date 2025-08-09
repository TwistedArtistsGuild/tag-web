/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getRandomStockPhotoByCategory, getRandomStockPhotos } from '@/utils/stockPhotos';

// Dynamic import for the new CardFactory system
const CardFactory = dynamic(() => import('@/components/cards/CardFactory'), { ssr: false });

export default function CardDemo() {
  const [activeTab, setActiveTab] = useState('artist');

  // Get stock photos for consistent demo data
  const artistGallery = getRandomStockPhotos(6).map((url, index) => ({
    url,
    alttext: `Artwork ${index + 1}`
  }));

  const sculptureGallery = getRandomStockPhotos(2).map((url, index) => ({
    url,
    alttext: `Digital sculpture ${index + 1}`
  }));

  // Mock artist data to test the cards
  const mockArtist = {
    artistid: 'demo-1',
    title: 'Jane Artist',
    name: 'Jane Artist',
    byline: 'Contemporary mixed media artist exploring themes of nature and technology',
    description: 'Contemporary mixed media artist exploring themes of nature and technology',
    path: 'jane-artist',
    slug: 'jane-artist',
    profilePic: {
      url: getRandomStockPhotoByCategory('artist'),
      alttext: 'Jane Artist profile picture'
    },
    coverPic: {
      url: getRandomStockPhotoByCategory('painting'),
      alttext: 'Jane Artist cover photo'
    },
    gallery: artistGallery,
    metadata: {
      isVerified: true,
      location: 'Portland, OR',
      memberSince: '2020-03-15',
      specialties: ['Mixed Media', 'Digital Art', 'Photography']
    },
    loves: 142,
    likes: 89,
    followers: 256
  };

  const mockArtistMinimal = {
    artistid: 'demo-2',
    title: 'Bob Creator',
    byline: 'Digital sculptor',
    path: 'bob-creator',
    profilePic: {
      url: getRandomStockPhotoByCategory('artist'),
      alttext: 'Bob Creator profile picture'
    },
    coverPic: {
      url: getRandomStockPhotoByCategory('performance'),
      alttext: 'Bob Creator cover photo'
    },
    gallery: sculptureGallery,
    metadata: {
      isVerified: false,
      location: 'Seattle, WA',
      memberSince: '2022-08-20',
      specialties: ['3D Modeling', 'Sculpture']
    },
    loves: 67,
    likes: 34,
    followers: 123
  };

  // Mock listing data based on data dictionary
  const mockListing = {
    PictureID: 'listing-1',
    Title: 'Sunset Over the Mountains',
    Description: 'A breathtaking landscape painting capturing the golden hour light cascading over mountain peaks. This piece explores the interplay of warm and cool tones, creating a sense of depth and tranquility.',
    URL: getRandomStockPhotoByCategory('painting'),
    ThumbnailURL: getRandomStockPhotoByCategory('painting'),
    AltText: 'Mountain sunset landscape painting',
    Context: 'Created during a summer residency in the Rocky Mountains',
    Created: '2025-07-15T14:30:00Z',
    ArtistID: 'demo-1',
    artist: mockArtist,
    likes: 89,
    hearts: 142,
    comments: 23,
    views: 847,
    shares: 12
  };

  const mockListingMinimal = {
    PictureID: 'listing-2', 
    Title: 'Digital Dreams',
    Description: 'An exploration of digital consciousness through abstract forms and vibrant colors.',
    URL: getRandomStockPhotoByCategory('digital'),
    ArtistID: 'demo-2',
    artistName: 'Bob Creator',
    artistPath: 'bob-creator',
    likes: 34,
    hearts: 67,
    comments: 8,
    views: 234
  };

  const mockListingExtended = {
    PictureID: 'listing-3',
    Title: 'Abstract Composition #7',
    Description: 'A vibrant abstract piece that explores the relationship between color, form, and movement. Using acrylic on canvas, this work represents a breakthrough in my artistic journey.',
    URL: getRandomStockPhotoByCategory('photography'),
    ThumbnailURL: getRandomStockPhotoByCategory('photography'),
    AltText: 'Abstract composition with vibrant colors',
    Context: 'Part of the "New Directions" series, 2025',
    Created: '2025-06-20T09:15:00Z',
    ArtistID: 'demo-1',
    artist: mockArtist,
    likes: 156,
    hearts: 234,
    comments: 45,
    views: 1203,
    shares: 28
  };

  return (
    <>
      <Head>
        <title>Enhanced Card Component Demo - TAG</title>
        <meta name="description" content="Demo page for testing enhanced card components with gallery options, social integration, and comment sections" />
      </Head>

      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Card Component Demo</h1>
            <p className="text-lg text-base-content/80 mb-6">
              Testing artist cards, listing cards, and all variants with interactive features
            </p>
            <div className="alert alert-info max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span>
                  <strong>Demo Mode:</strong> Explore different card types and variants. 
                  Switch tabs to see artist cards vs listing cards in action!
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs tabs-boxed justify-center mb-8">
            <button 
              className={`tab ${activeTab === 'artist' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('artist')}
            >
              Artist Cards
            </button>
            <button 
              className={`tab ${activeTab === 'listing' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('listing')}
            >
              Listing Cards
            </button>
            <button 
              className={`tab ${activeTab === 'compare' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('compare')}
            >
              Side by Side
            </button>
            <button 
              className={`tab ${activeTab === 'gallery' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery Layouts
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[800px]">
            
            {/* Artist Cards Tab */}
            {activeTab === 'artist' && (
              <div className="space-y-12">
                
                {/* Micro Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Micro Cards (Badge Style)</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;artist&quot;, variant=&quot;micro&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Perfect for blog author credits, comment headers, or any inline artist references
                    </p>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-base-100 p-6 rounded-lg border border-base-300">
                      <h3 className="text-lg font-semibold mb-3">The Future of Digital Art in Web3</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-base-content/70">By</span>
                        <CardFactory 
                          type="artist"
                          variant="micro"
                          data={mockArtist} 
                        />
                        <span className="text-sm text-base-content/70">• 5 min read</span>
                      </div>
                      <p className="text-base-content/80 mb-4">
                        The intersection of digital art and blockchain technology is creating unprecedented opportunities...
                      </p>
                      <div className="text-sm text-base-content/60">
                        <span>Contributors: </span>
                        <CardFactory 
                          type="artist"
                          variant="micro"
                          data={mockArtistMinimal}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Small Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Small Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;artist&quot;, variant=&quot;small&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Sidebar widgets, grid layouts, compact directory listings
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardFactory
                      type="artist"
                      variant="small"
                      data={mockArtist}
                      orientation="vertical"
                    />
                    <CardFactory
                      type="artist"
                      variant="small"
                      data={mockArtistMinimal}
                      orientation="vertical"
                    />
                  </div>
                </section>

                {/* Medium Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Medium Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;artist&quot;, variant=&quot;medium&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Featured artist sections, main content areas
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <CardFactory
                      type="artist"
                      variant="medium"
                      data={mockArtist}
                      orientation="horizontal"
                    />
                    <CardFactory
                      type="artist"
                      variant="medium"
                      data={mockArtistMinimal}
                      orientation="vertical"
                    />
                  </div>
                </section>

                {/* Large Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Large Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;artist&quot;, variant=&quot;large&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Artist profile pages, detailed portfolio displays
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    <CardFactory 
                      type="artist"
                      variant="large"
                      data={mockArtist} 
                      orientation="vertical"
                      galleryType="tiled"
                    />
                  </div>
                </section>

                {/* Full Width Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Full Width Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;artist&quot;, variant=&quot;fullwidth&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Hero sections, landing pages, detailed artist showcases
                    </p>
                  </div>
                  
                  <CardFactory
                    type="artist"
                    variant="fullwidth"
                    data={mockArtist}
                    galleryType="carousel"
                  />
                </section>
              </div>
            )}

            {/* Listing Cards Tab */}
            {activeTab === 'listing' && (
              <div className="space-y-12">
                
                {/* Micro Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Micro Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;micro&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Gallery thumbnails, compact grids, mobile displays
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Ultra-compact size, hover overlay, minimal info
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={mockListing}
                    />
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={mockListingMinimal}
                    />
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-3',
                        Title: 'Urban Abstractions',
                        URL: getRandomStockPhotoByCategory('photography')
                      }}
                    />
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-4',
                        Title: 'Nature Study',
                        URL: getRandomStockPhotoByCategory('sculpture')
                      }}
                    />
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-5',
                        Title: 'Digital Art',
                        URL: getRandomStockPhotoByCategory('digital')
                      }}
                    />
                    <CardFactory
                      type="listing"
                      variant="micro"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-6',
                        Title: 'Portrait Work',
                        URL: getRandomStockPhotoByCategory('painting')
                      }}
                    />
                  </div>
                </section>

                {/* Small Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Small Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;small&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Grid galleries, thumbnail views, related artwork suggestions
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Square aspect ratio, inline artist micro card, basic interactions
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <CardFactory
                      type="listing"
                      variant="small"
                      data={mockListing}
                    />
                    <CardFactory
                      type="listing"
                      variant="small"
                      data={mockListingMinimal}
                    />
                    <CardFactory
                      type="listing"
                      variant="small"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-3',
                        Title: 'Urban Abstractions',
                        URL: getRandomStockPhotoByCategory('photography')
                      }}
                    />
                    <CardFactory
                      type="listing"
                      variant="small"
                      data={{
                        ...mockListing,
                        PictureID: 'listing-4',
                        Title: 'Nature Study',
                        URL: getRandomStockPhotoByCategory('sculpture'),
                        showInteractions: false
                      }}
                    />
                  </div>
                </section>

                {/* Medium Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Medium Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;medium&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Main content feed, search results, portfolio displays
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Artist small card, description snippet, context info, full interactions
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <CardFactory
                      type="listing"
                      variant="medium"
                      data={mockListing}
                      orientation="horizontal"
                    />
                    <CardFactory
                      type="listing"
                      variant="medium"
                      data={mockListingExtended}
                      orientation="vertical"
                    />
                    <CardFactory
                      type="listing"
                      variant="medium"
                      data={mockListingMinimal}
                      orientation="horizontal"
                    />
                  </div>
                </section>

                {/* Large Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Large Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;large&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Featured artwork, detailed art pages, social media style posts
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Expanded artist card, full description, creation date, action buttons
                    </p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto space-y-8">
                    <CardFactory
                      type="listing"
                      variant="large"
                      data={mockListing}
                      showFullDescription={true}
                    />
                    <CardFactory
                      type="listing"
                      variant="large"
                      data={mockListingExtended}
                      showFullDescription={true}
                    />
                  </div>
                </section>

                {/* Full-Width Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Full-Width Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;fullwidth&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> Hero sections, featured artwork pages, exhibition displays
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Large image display, comprehensive details, artist information, multiple orientations
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    <CardFactory
                      type="listing"
                      variant="fullwidth"
                      data={mockListing}
                      orientation="horizontal"
                      galleryType="featured"
                    />
                    <CardFactory
                      type="listing"
                      variant="fullwidth"
                      data={mockListingExtended}
                      orientation="vertical"
                    />
                  </div>
                </section>

                {/* Checkout Listing Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Checkout Listing Cards</h2>
                  <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                    <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                    <code className="text-xs bg-base-200 px-2 py-1 rounded">type=&quot;listing&quot;, variant=&quot;checkout&quot;</code>
                    <p className="text-xs text-base-content/70 mt-2">
                      <strong>Use Case:</strong> E-commerce pages, purchase flows, cart items
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      <strong>Features:</strong> Pricing display, quantity selector, purchase buttons, shipping info
                    </p>
                  </div>
                  
                  <div className="max-w-4xl mx-auto space-y-8">
                    <CardFactory
                      type="listing"
                      variant="checkout"
                      data={mockListing}
                      onAddToCart={(listing, quantity) => {
                        console.log('Add to cart:', listing.Title, 'Quantity:', quantity);
                        alert(`Added "${listing.Title}" (${quantity}) to cart!`);
                      }}
                      onBuyNow={(listing, quantity) => {
                        console.log('Buy now:', listing.Title, 'Quantity:', quantity);
                        alert(`Purchasing "${listing.Title}" (${quantity}) now!`);
                      }}
                    />
                    <CardFactory
                      type="listing"
                      variant="checkout"
                      data={mockListingExtended}
                      onAddToCart={(listing, quantity) => {
                        console.log('Add to cart:', listing.Title, 'Quantity:', quantity);
                        alert(`Added "${listing.Title}" (${quantity}) to cart!`);
                      }}
                      onBuyNow={(listing, quantity) => {
                        console.log('Buy now:', listing.Title, 'Quantity:', quantity);
                        alert(`Purchasing "${listing.Title}" (${quantity}) now!`);
                      }}
                    />
                  </div>
                </section>

                {/* Data Structure Demo */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Data Structure Flexibility</h2>
                  <div className="bg-base-100 rounded-lg p-6 shadow-lg">
                    <p className="mb-4 text-base-content/80">
                      Listing cards handle different data structures with fallbacks based on the data dictionary:
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Full data structure */}
                      <div>
                        <h4 className="text-md font-medium mb-2">Full Data Structure</h4>
                        <p className="text-xs text-base-content/60 mb-3">
                          Uses Picture entity fields: PictureID, Title, Description, URL, ArtistID, etc.
                        </p>
                        <CardFactory 
                          type="listing"
                          variant="medium"
                          data={mockListing}
                          orientation="vertical"
                        />
                      </div>

                      {/* Minimal data structure */}
                      <div>
                        <h4 className="text-md font-medium mb-2">Minimal Data Structure</h4>
                        <p className="text-xs text-base-content/60 mb-3">
                          Uses fallback fields and basic info only
                        </p>
                        <CardFactory 
                          type="listing"
                          variant="medium"
                          data={{
                            PictureID: 'minimal-listing',
                            title: 'Minimal Artwork', // fallback field
                            url: getRandomStockPhotoByCategory('painting'), // fallback field
                            artistName: 'Unknown Artist'
                          }}
                          orientation="vertical"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Side by Side Comparison Tab */}
            {activeTab === 'compare' && (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Artist vs Listing Cards - Size Comparison</h2>
                  
                  {/* Micro/Small Comparison */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Micro & Small Cards</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-3">Artist Cards</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-base-100 rounded">
                            <span className="text-xs text-base-content/60 mb-2 block">Micro:</span>
                            <CardFactory type="artist" variant="micro" data={mockArtist} />
                          </div>
                          <div className="p-3 bg-base-100 rounded">
                            <span className="text-xs text-base-content/60 mb-2 block">Small:</span>
                            <CardFactory type="artist" variant="small" data={mockArtist} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Listing Cards</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-base-100 rounded">
                            <span className="text-xs text-base-content/60 mb-2 block">Small (no micro variant):</span>
                            <CardFactory type="listing" variant="small" data={mockListing} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medium Comparison */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Medium Cards</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-3">Artist Card</h4>
                        <CardFactory type="artist" variant="medium" data={mockArtist} orientation="vertical" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Listing Card</h4>
                        <CardFactory type="listing" variant="medium" data={mockListing} orientation="vertical" />
                      </div>
                    </div>
                  </div>

                  {/* Large Comparison */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Large Cards</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-3">Artist Card</h4>
                        <CardFactory type="artist" variant="large" data={mockArtist} orientation="vertical" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Listing Card</h4>
                        <CardFactory type="listing" variant="large" data={mockListing} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Gallery Layouts Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Mixed Gallery Layouts</h2>
                  
                  {/* Art Gallery Style */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Art Gallery Grid</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <CardFactory type="listing" variant="small" data={mockListing} />
                      <CardFactory type="listing" variant="small" data={mockListingMinimal} />
                      <CardFactory type="listing" variant="small" data={{
                        ...mockListing,
                        PictureID: 'listing-4',
                        Title: 'Abstract Composition',
                        URL: getRandomStockPhotoByCategory('digital')
                      }} />
                      <CardFactory type="listing" variant="small" data={{
                        ...mockListing,
                        PictureID: 'listing-5',
                        Title: 'Nature Study',
                        URL: getRandomStockPhotoByCategory('painting')
                      }} />
                      <CardFactory type="listing" variant="small" data={{
                        ...mockListing,
                        PictureID: 'listing-6',
                        Title: 'Portrait Series',
                        URL: getRandomStockPhotoByCategory('photography')
                      }} />
                      <CardFactory type="listing" variant="small" data={{
                        ...mockListing,
                        PictureID: 'listing-7',
                        Title: 'Mixed Media',
                        URL: getRandomStockPhotoByCategory('sculpture')
                      }} />
                    </div>
                  </div>

                  {/* Artist Directory Style */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Artist Directory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CardFactory type="artist" variant="small" data={mockArtist} orientation="horizontal" />
                      <CardFactory type="artist" variant="small" data={mockArtistMinimal} orientation="horizontal" />
                    </div>
                  </div>

                  {/* Featured Content Feed */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Social Media Style Feed</h3>
                    <div className="max-w-2xl mx-auto space-y-6">
                      <CardFactory type="listing" variant="large" data={mockListing} />
                      <CardFactory type="listing" variant="medium" data={mockListingExtended} orientation="vertical" />
                      <CardFactory type="artist" variant="medium" data={mockArtist} orientation="horizontal" />
                    </div>
                  </div>

                  {/* Mixed Layout */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Mixed Content Layout</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <CardFactory type="listing" variant="medium" data={mockListing} orientation="horizontal" />
                        <CardFactory type="listing" variant="medium" data={mockListingExtended} orientation="horizontal" />
                      </div>
                      <div className="space-y-4">
                        <CardFactory type="artist" variant="small" data={mockArtist} orientation="vertical" />
                        <CardFactory type="artist" variant="small" data={mockArtistMinimal} orientation="vertical" />
                        <div className="grid grid-cols-2 gap-2">
                          <CardFactory type="listing" variant="small" data={mockListing} />
                          <CardFactory type="listing" variant="small" data={mockListingMinimal} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}