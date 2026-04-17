/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from "next/head"
import Image from "next/image" // Import Image component
import Link from "next/link" // Import Link component
import { SparklesIcon, BookOpenIcon, HeartIcon, MessageCircleIcon, ShareIcon, EyeIcon } from "lucide-react" // Import Lucide icons
import { SocialRealtimeProvider } from "../../components/social/SocialRealtimeContext"
import { useState } from "react"

export default function News() {
  // Social data state for articles
  const [socialData, setSocialData] = useState({
    "beyond-canvas": { views: 1234, loves: 89, comments: 23, shares: 45 },
    "member-interviews": { views: 2156, loves: 167, comments: 42, shares: 78 },
    "art-algorithms": { views: 1890, loves: 203, comments: 67, shares: 91 },
    "studio-cooperative": { views: 1567, loves: 134, comments: 38, shares: 56 }
  });

  const handleSocialAction = (articleId, action) => {
    setSocialData(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        [action]: prev[articleId][action] + 1
      }
    }));
  };

  return (
    <SocialRealtimeProvider>
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-primary">
            Twisted Artists Guild News Service
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
            Amplifying artist voices. Exploring the pulse of creativity.
          </p>
          {/* Social Features Badge */}
          <div className="badge badge-primary badge-lg gap-2 mb-4">
            <HeartIcon className="w-4 h-4" />
            <span>Interactive Social Features Enabled</span>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg"
            alt="News service background image"
            fill
            priority
            className="object-cover"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      </section>
      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        {/* News Service Section */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary text-center">
            🎙️ Twisted Artists Guild News Service
          </h2>
          <p className="text-xl text-center mb-12 text-secondary">
            Amplifying artist voices. Exploring the pulse of creativity.
          </p>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-700 mb-6">
              The TAG News Service is a storytelling initiative powered by our marketing department, designed to
              spotlight the lives, ideas, and creative journeys of our cooperative’s members. Through rich interviews,
              cultural coverage, and market research, we document what it means to be a working artist today—with
              integrity, curiosity, and a community-first lens.
            </p>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-primary">
              ✨ Our Purpose
            </h3>
            <p className="text-lg text-gray-700">
              Our journalist team works at the intersection of marketing and editorial, blending narrative storytelling
              with cooperative insight. They conduct interviews from scripted research prompts, capture close-up
              conversations with artists, and produce engaging social content that benefits visibility and discovery.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              While rooted in marketing, this branch of TAG follows ethical journalistic standards. In addition to
              research-driven interviews, our writers pursue broader art coverage—from gallery openings and emerging
              trends to artist-led movements—always centered on the voices of creators.
            </p>
          </div>
          <h3 className="text-xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-primary">
            📚 Featured Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Article Card 1: Amina Rodriguez - Multidisciplinary Storyteller */}
            <div className="card bg-base-200 shadow-xl overflow-hidden group">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg"
                  alt="Artist painting on a canvas"
                  fill
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  Beyond the Canvas: Meet Amina Rodriguez, a Multidisciplinary Storyteller
                </h4>
                <p className="text-gray-700 text-sm">
                  Amina blends textile, digital collage, and immersive installations to explore identity and memory. We
                  unpack her process, her cooperative mindset, and how shared authorship shapes her latest exhibition.
                </p>
                
                {/* Enhanced Social Section */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-base-content/60">
                      <EyeIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["beyond-canvas"].views}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction("beyond-canvas", 'loves')}
                      className="flex items-center gap-1 text-error hover:scale-105 transition-transform cursor-pointer"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["beyond-canvas"].loves}</span>
                    </button>
                    <div className="flex items-center gap-1 text-base-content/60">
                      <MessageCircleIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["beyond-canvas"].comments}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction("beyond-canvas", 'shares')}
                      className="flex items-center gap-1 text-info hover:scale-105 transition-transform cursor-pointer"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["beyond-canvas"].shares}</span>
                    </button>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 2: What Artists Really Need - Insights from Interviews */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg"
                  alt="Artist's paint palette with brushes"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  What Artists Really Need: Insights from Our Member Interviews
                </h4>
                <p className="text-gray-700 text-sm">
                  From tools to pricing, our journalists analyzed data from extended interviews with TAG members to
                  uncover what drives artist success—and what platforms must evolve to meet their needs.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 3: Art & Algorithms - Hacking AI for Good */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg"
                  alt="Artist painting a large mural"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  Art & Algorithms: How Creatives Are Hacking AI for Good
                </h4>
                <p className="text-gray-700 text-sm">
                  We explore how TAG artists are turning generative tech into collaborative tools—from training models
                  on personal portfolios to co-authoring with bots. This isn’t automation; it’s augmentation.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 4: The Studio is the Cooperative - Shared Governance */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg"
                  alt="Artist working on a large mural in a studio"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  The Studio is the Cooperative: Why Shared Governance Fuels Better Art
                </h4>
                <p className="text-gray-700 text-sm">
                  A deep dive into how collective decision-making—from stock buybacks to platform features—is rewriting
                  what creative ownership can look like. Hear from members building this new reality.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action / Footer */}
        <section className="py-16 bg-gradient-to-r from-purple-800 to-pink-700 rounded-box shadow-lg px-6">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Stay Informed with TAG News</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
              Subscribe to our newsletter for the latest articles, artist spotlights, and industry insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/newsletter" className="btn btn-lg btn-primary">
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
    </SocialRealtimeProvider>
  )
}
