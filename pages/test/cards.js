/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getRandomStockPhotoByCategory, getRandomStockPhotos } from '@/utils/stockPhotos';

// Dynamic import for the new CardFactory system
const CardFactory = dynamic(() => import('@/components/cards/CardFactory'), { ssr: false });

export default function CardDemo() {
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
    name: 'Jane Artist', // fallback
    byline: 'Contemporary mixed media artist exploring themes of nature and technology',
    description: 'Contemporary mixed media artist exploring themes of nature and technology', // fallback
    path: 'jane-artist',
    slug: 'jane-artist', // fallback
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

  return (
    <>
      <Head>
        <title>Enhanced Card Component Demo - TAG</title>
        <meta name="description" content="Demo page for testing enhanced card components with gallery options, social integration, and comment sections" />
      </Head>

      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Enhanced Card Component Demo</h1>
            <p className="text-lg text-base-content/80">
              Testing gallery options, full-width cards, modular social integration, and comment sections
            </p>
          </div>

          {/* Micro Cards - Badge Style */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Micro Cards (Badge Style)</h2>
            
            <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
              <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium">Card 1:</span>
                  <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;micro&quot;</code>
                </div>
                <div>
                  <span className="font-medium">Card 2:</span>
                  <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;micro&quot;, showBio=true</code>
                </div>
              </div>
              <div className="mt-2 text-xs text-base-content/70">
                <span className="font-medium">Use Case:</span> Perfect for blog author credits, comment headers, or any inline artist references
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="mb-4">
                Here&apos;s an example blog post excerpt using micro cards for author attribution:
              </p>
              
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
                  The intersection of digital art and blockchain technology is creating unprecedented opportunities for artists to monetize their work and connect directly with collectors...
                </p>
                <div className="text-sm text-base-content/60">
                  <span>Contributors: </span>
                  <CardFactory 
                    type="artist"
                    variant="micro"
                    data={mockArtistMinimal}
                    showBio={true} 
                  />
                  <span className="mx-2">•</span>
                  <CardFactory 
                    type="artist"
                    variant="micro"
                    data={mockArtist}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Artist Card Sizes Demo */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Artist Card Sizes</h2>
            
            {/* Small Cards */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Small Cards</h3>
              
              {/* Configuration Display */}
              <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Card 1:</span> 
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;small&quot;, orientation=&quot;horizontal&quot;</code>
                  </div>
                  <div>
                    <span className="font-medium">Card 2:</span>
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;small&quot;, orientation=&quot;vertical&quot;</code>
                  </div>
                  <div>
                    <span className="font-medium">Card 3:</span>
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;small&quot;, interactive=false</code>
                  </div>
                </div>
                <div className="mt-2 text-xs text-base-content/70">
                  <span className="font-medium">Gallery:</span> Simple arrows only, no thumbnails or fullscreen
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CardFactory 
                  type="artist"
                  variant="small"
                  data={mockArtist} 
                  orientation="horizontal"
                />
                <CardFactory 
                  type="artist"
                  variant="small"
                  data={mockArtistMinimal} 
                  orientation="vertical"
                />
                <CardFactory 
                  type="artist"
                  variant="small"
                  data={mockArtist} 
                  orientation="horizontal"
                  interactive={false}
                />
              </div>
            </div>

            {/* Medium Cards */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Medium Cards</h3>
              
              {/* Configuration Display */}
              <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Card 1:</span> 
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;medium&quot;, orientation=&quot;horizontal&quot;</code>
                  </div>
                  <div>
                    <span className="font-medium">Card 2:</span>
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;medium&quot;, orientation=&quot;vertical&quot;</code>
                  </div>
                </div>
                <div className="mt-2 text-xs text-base-content/70">
                  <span className="font-medium">Gallery:</span> Thumbnails + navigation arrows, no fullscreen
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>

            {/* Large Cards */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Large Cards</h3>
              
              {/* Configuration Display */}
              <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Card 1:</span> 
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;large&quot;, orientation=&quot;horizontal&quot;, galleryType=&quot;tiled&quot;, showComments=true</code>
                  </div>
                  <div>
                    <span className="font-medium">Card 2:</span>
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;large&quot;, orientation=&quot;vertical&quot;, galleryType=&quot;carousel&quot;, showComments=true</code>
                  </div>
                </div>
                <div className="mt-2 text-xs text-base-content/70">
                  <span className="font-medium">Features:</span> Cover photos with gradient overlay, full gallery features, text-shadow for visibility
                </div>
              </div>

              <div className="space-y-6">
                <CardFactory 
                  type="artist"
                  variant="large"
                  data={mockArtist} 
                  orientation="horizontal"
                  galleryType="tiled"
                  showComments={true}
                />
                <CardFactory 
                  type="artist"
                  variant="large"
                  data={mockArtistMinimal} 
                  orientation="vertical"
                  galleryType="carousel"
                  showComments={true}
                />
              </div>
            </div>

            {/* Full Width Cards */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Full Width Cards</h3>
              
              {/* Configuration Display */}
              <div className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300">
                <h4 className="font-medium text-sm mb-2">Configuration Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Card 1:</span> 
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;fullwidth&quot;, galleryType=&quot;tiled&quot;, showComments=true</code>
                  </div>
                  <div>
                    <span className="font-medium">Card 2:</span>
                    <code className="ml-1 text-xs bg-base-200 px-1 rounded">type=&quot;artist&quot;, variant=&quot;fullwidth&quot;, galleryType=&quot;carousel&quot;, showComments=true</code>
                  </div>
                </div>
                <div className="mt-2 text-xs text-base-content/70">
                  <span className="font-medium">Features:</span> Large cover photos (h-64 lg:h-80), metadata section, comments section, maximum gallery features
                </div>
              </div>

              <div className="space-y-6">
                <CardFactory 
                  type="artist"
                  variant="fullwidth"
                  data={mockArtist} 
                  galleryType="tiled"
                  showComments={true}
                />
                <CardFactory 
                  type="artist"
                  variant="fullwidth"
                  data={mockArtistMinimal} 
                  galleryType="carousel"
                  showComments={true}
                />
              </div>
            </div>
          </section>

          {/* Gallery Type Demo */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Gallery Type Comparison</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Tiled Gallery */}
              <div>
                <h3 className="text-lg font-medium mb-3">Tiled Gallery</h3>
                <CardFactory 
                  type="artist"
                  variant="large"
                  data={mockArtist} 
                  orientation="vertical"
                  galleryType="tiled"
                  showComments={false}
                />
              </div>

              {/* Carousel Gallery */}
              <div>
                <h3 className="text-lg font-medium mb-3">Carousel Gallery</h3>
                <CardFactory 
                  type="artist"
                  variant="large"
                  data={mockArtist} 
                  orientation="vertical"
                  galleryType="carousel"
                  showComments={false}
                />
              </div>
            </div>
          </section>

          {/* Responsive Demo */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Responsive Card Examples</h2>
            <div className="space-y-6">
              
              {/* Sidebar Style (Small) */}
              <div>
                <h3 className="text-lg font-medium mb-3">Sidebar Style (Small, Vertical)</h3>
                <div className="bg-base-100 p-4 rounded-lg w-64">
                  <CardFactory
                    type="artist"
                    variant="small"
                    data={mockArtist}
                    orientation="vertical"
                    interactive={false}
                  />
                </div>
              </div>

              {/* Featured Artist Style (Medium) */}
              <div>
                <h3 className="text-lg font-medium mb-3">Featured Artist Style (Medium, Horizontal)</h3>
                <CardFactory
                  type="artist"
                  variant="medium"
                  data={mockArtist}
                  orientation="horizontal"
                />
              </div>

              {/* Hero Style (Large) */}
              <div>
                <h3 className="text-lg font-medium mb-3">Hero Style (Large, Vertical)</h3>
                <div className="max-w-md mx-auto">
                  <CardFactory
                    type="artist"
                    variant="large"
                    data={mockArtist}
                    orientation="vertical"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Data Structure Demo */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Data Structure Flexibility</h2>
            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
              <p className="mb-4 text-base-content/80">
                The cards handle different data structures gracefully with fallbacks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full data structure */}
                <div>
                  <h4 className="text-md font-medium mb-2">Full Data Structure</h4>
                  <CardFactory 
                    type="artist"
                    variant="medium"
                    data={{
                      artistid: 'full-data',
                      title: 'Full Data Artist',
                      byline: 'All fields populated',
                      path: 'full-data-artist',
                      profilePic: {
                        url: 'https://i.pravatar.cc/150?img=45',
                        alttext: 'Full data artist profile'
                      },
                      loves: 42,
                      likes: 28,
                      followers: 95
                    }} 
                    orientation="vertical"
                  />
                </div>

                {/* Minimal data structure */}
                <div>
                  <h4 className="text-md font-medium mb-2">Minimal Data Structure</h4>
                  <CardFactory 
                    type="artist"
                    variant="medium"
                    data={{
                      name: 'Minimal Artist', // using fallback field
                      description: 'Using fallback fields', // using fallback field
                      artistid: 'minimal-data'
                    }} 
                    orientation="vertical"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
              <div className="prose max-w-none">
                <pre className="bg-base-200 p-4 rounded text-sm overflow-x-auto">
{`// CardFactory usage examples
import { CardFactory } from '@/components/cards';

// Small card for sidebars/grids
<CardFactory 
  type="artist"
  variant="small"
  data={artist} 
  orientation="vertical" 
/>

// Medium card with tiled gallery
<CardFactory 
  type="artist"
  variant="medium"
  data={artist} 
  orientation="horizontal"
  galleryType="tiled"
/>

// Large card with carousel gallery and comments
<CardFactory 
  type="artist"
  variant="large"
  data={artist} 
  orientation="vertical"
  galleryType="carousel"
  showComments={true}
/>

// Full-width hero card with all features
<CardFactory 
  type="artist"
  variant="fullwidth"
  data={artist} 
  galleryType="tiled"
  showComments={true}
  showSocials={true}
/>

// Gallery type options:
// - 'tiled': Grid layout for multiple images
// - 'carousel': Slideshow with navigation

// Card variants:
// - 'small': Compact for grids/sidebars
// - 'medium': Standard card with 2-image gallery
// - 'large': Detailed card with 4-image gallery + comments
// - 'fullwidth': Hero card with extended features`}
                </pre>
              </div>
            </div>
          </section>

          {/* Configuration Summary */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Complete Configuration Reference</h2>
            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-medium mb-4">Card Variant Features</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th>Cover Photo</th>
                      <th>Gallery Features</th>
                      <th>Comments</th>
                      <th>Metadata</th>
                      <th>Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code className="text-xs">small</code></td>
                      <td>❌</td>
                      <td>Arrows only</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>Sidebars, grids</td>
                    </tr>
                    <tr>
                      <td><code className="text-xs">medium</code></td>
                      <td>❌</td>
                      <td>Thumbnails + arrows</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>Feature lists, search results</td>
                    </tr>
                    <tr>
                      <td><code className="text-xs">large</code></td>
                      <td>✅ (h-48 lg:h-64)</td>
                      <td>Full gallery</td>
                      <td>❌</td>
                      <td>✅</td>
                      <td>Profile pages, portfolios</td>
                    </tr>
                    <tr>
                      <td><code className="text-xs">fullwidth</code></td>
                      <td>✅ (h-64 lg:h-80)</td>
                      <td>Maximum features</td>
                      <td>✅</td>
                      <td>✅</td>
                      <td>Hero sections, detailed profiles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Available Props</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Required:</span>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li><code>type=&quot;artist&quot;</code></li>
                      <li><code>variant=&quot;small|medium|large|fullwidth&quot;</code></li>
                      <li><code>data=&#123;artistData&#125;</code></li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Optional:</span>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li><code>orientation=&quot;horizontal|vertical&quot;</code></li>
                      <li><code>galleryType=&quot;tiled|carousel&quot;</code></li>
                      <li><code>showSocials=&#123;true|false&#125;</code></li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Large/FullWidth only:</span>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li><code>showComments=&#123;true|false&#125;</code></li>
                      <li><code>interactive=&#123;true|false&#125;</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
