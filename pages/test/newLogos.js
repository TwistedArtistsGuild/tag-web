/* Test page for experimenting with logos in different styles - TAG Brand Guidelines */

import { useState } from 'react'
import Image from 'next/image'

export default function NewLogosTest() {
  const [selectedStyle, setSelectedStyle] = useState('indigo')
  const [activeTab, setActiveTab] = useState('guidelines')

  // Brand Colors from Guidelines
  const brandColors = {
    ghostWhite: '#F5F5FC',
    onyx: '#151318',
    indigo: '#6233FF',
    chartreuse: '#CEFF1D',
  }

  const styles = {
    indigo: {
      bg: 'bg-[#6233FF]',
      text: 'text-[#F5F5FC]',
      border: 'border-[#CEFF1D]',
      name: 'Electric Indigo',
    },
    chartreuse: {
      bg: 'bg-[#CEFF1D]',
      text: 'text-[#151318]',
      border: 'border-[#6233FF]',
      name: 'Chartreuse',
    },
    onyx: {
      bg: 'bg-[#151318]',
      text: 'text-[#F5F5FC]',
      border: 'border-[#6233FF]',
      name: 'Onyx',
    },
    theme: {
      bg: 'bg-base-100',
      text: 'text-base-content',
      border: 'border-primary',
      name: 'Theme',
    },
  }

  // Corner radius for soft corners (24px)
  const cornerRadius = '24px'

  const logos = [
    {
      name: 'Horizontal (Hollow White)',
      file: 'HORIZONTAL (HOLLOW WHITE).png',
      description: 'Clearspace Logo - Ideal for lighter applications',
    },
    {
      name: 'TAG (Filled)',
      file: 'TAG (FILLED).png',
      description: 'Standard Mark - High contrast usage',
    },
    {
      name: 'TAG (Hollow)',
      file: 'TAG (HOLLOW).png',
      description: 'Clearspace Mark - Lightweight & open',
    },
    {
      name: 'Vertical (Hollow White)',
      file: 'VERTICAL (HOLLOW WHITE).png',
      description: 'Clearspace Logo - Vertical layout',
    },
  ]

  const currentStyle = styles[selectedStyle]

  return (
    <div
      className={`min-h-screen ${currentStyle.bg} ${currentStyle.text} transition-all duration-500`}
      style={{
        fontFamily: "'Manrope', sans-serif",
        backgroundColor: selectedStyle === 'theme' ? 'var(--color-base-100, #fff)' : (brandColors[selectedStyle] || '#fff'),
        color: selectedStyle === 'theme' ? 'var(--color-base-content, #000)' : (currentStyle.text.includes('151318') ? '#151318' : '#F5F5FC'),
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex items-center gap-6">
          <div className="relative w-24 h-24">
            <Image
              src="/TAG (FILLED).png"
              alt="TAG Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tight" style={{ fontWeight: 800 }}>
              TAG Brand Guidelines
            </h1>
            <p className="text-lg opacity-80" style={{ fontWeight: 500 }}>
              Stylized nodes represent the intersection of creativity, collaboration, and growth.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mb-12 flex gap-4 border-b-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'guidelines' ? 'border-b-4' : 'opacity-60 hover:opacity-80'}`}
            style={{
              borderColor: activeTab === 'guidelines' ? brandColors[selectedStyle] === '#CEFF1D' ? '#151318' : '#CEFF1D' : 'transparent',
              fontWeight: 600,
            }}
          >
            Brand Guidelines
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'logos' ? 'border-b-4' : 'opacity-60 hover:opacity-80'}`}
            style={{
              borderColor: activeTab === 'logos' ? brandColors[selectedStyle] === '#CEFF1D' ? '#151318' : '#CEFF1D' : 'transparent',
              fontWeight: 600,
            }}
          >
            Logos
          </button>
        </div>

        {/* Color Palette Selector - Logos Tab */}
        {activeTab === 'logos' && (
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(styles).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setSelectedStyle(key)}
              className={`p-4 font-semibold transition-all duration-300 border-2 ${selectedStyle === key ? 'scale-105 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              style={
                key === 'theme'
                  ? {
                      backgroundColor: 'var(--color-base-100, #fff)',
                      color: 'var(--color-base-content, #000)',
                      borderColor: selectedStyle === key ? 'var(--color-base-content, #000)' : 'transparent',
                      borderRadius: cornerRadius,
                    }
                  : {
                      backgroundColor: brandColors[key],
                      color: key === 'indigo' || key === 'onyx' ? '#F5F5FC' : '#151318',
                      borderColor: selectedStyle === key ? '#F5F5FC' : 'transparent',
                      borderRadius: cornerRadius,
                    }
              }
            >
              {style.name}
            </button>
          ))}
        </div>
        )}

        {/* Logo Grid - Logos Tab */}
        {activeTab === 'logos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {logos.map((logo) => {
            const borderColor = selectedStyle === 'theme' 
              ? 'var(--color-primary, #6233FF)' 
              : (currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF');
            
            const shadowFilter = selectedStyle === 'theme'
              ? 'drop-shadow(0 1px 3px rgba(21, 19, 24, 0.6)) drop-shadow(0 6px 24px color-mix(in srgb, var(--color-primary, #6233FF) 85%, transparent))'
              : (selectedStyle === 'indigo' || selectedStyle === 'onyx'
                ? 'drop-shadow(0 1px 3px rgba(21, 19, 24, 0.6)) drop-shadow(0 6px 24px rgba(98, 51, 255, 0.85))'
                : 'drop-shadow(0 1px 3px rgba(21, 19, 24, 0.6)) drop-shadow(0 6px 24px rgba(206, 255, 29, 0.85))');
            
            return (
            <div
              key={logo.file}
              className={`p-8 border-2 transition-all duration-300`}
              style={{
                borderColor: borderColor,
                backgroundColor: selectedStyle === 'theme' ? 'color-mix(in srgb, var(--color-base-100, #fff) 75%, var(--color-accent, #151318) 20%, var(--color-secondary, #CEFF1D) 5%)' : (selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)'),
                borderRadius: cornerRadius,
              }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ fontWeight: 700 }}>
                {logo.name}
              </h3>
              <p className="text-sm opacity-70 mb-6" style={{ fontWeight: 500 }}>
                {logo.description}
              </p>
              <div className="flex items-center justify-center min-h-64 bg-opacity-30" style={{ borderRadius: cornerRadius }}>
                <div className="relative w-full h-64" style={{
                  filter: shadowFilter
                }}>
                  <Image
                    src={`/${logo.file}`}
                    alt={logo.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
            );
          })}
        </div>
        )}

        {/* Theme Colors - When Theme is selected */}
        {activeTab === 'logos' && selectedStyle === 'theme' && (
        <div
          className="p-8 border-2 mb-12"
          style={{
            borderColor: 'var(--color-primary, #6233FF)',
            backgroundColor: 'var(--color-base-100, #fff)',
            borderRadius: cornerRadius,
          }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ fontWeight: 700, color: 'var(--color-base-content, #000)' }}>
            Active Theme Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className="h-24 mb-3 border-2"
                style={{ 
                  backgroundColor: 'var(--color-primary, #6233FF)',
                  borderColor: 'transparent',
                  borderRadius: cornerRadius,
                }}
              ></div>
              <p className="text-sm font-semibold" style={{ fontWeight: 600, color: 'var(--color-base-content, #000)' }}>
                Primary
              </p>
              <p className="text-xs opacity-60" style={{ fontWeight: 400, color: 'var(--color-base-content, #000)' }}>
                --color-primary
              </p>
            </div>
            <div className="text-center">
              <div
                className="h-24 mb-3 border-2"
                style={{ 
                  backgroundColor: 'var(--color-secondary, #CEFF1D)',
                  borderColor: 'transparent',
                  borderRadius: cornerRadius,
                }}
              ></div>
              <p className="text-sm font-semibold" style={{ fontWeight: 600, color: 'var(--color-base-content, #000)' }}>
                Secondary
              </p>
              <p className="text-xs opacity-60" style={{ fontWeight: 400, color: 'var(--color-base-content, #000)' }}>
                --color-secondary
              </p>
            </div>
            <div className="text-center">
              <div
                className="h-24 mb-3 border-2"
                style={{ 
                  backgroundColor: 'var(--color-accent, #151318)',
                  borderColor: 'var(--color-primary, #6233FF)',
                  borderRadius: cornerRadius,
                }}
              ></div>
              <p className="text-sm font-semibold" style={{ fontWeight: 600, color: 'var(--color-base-content, #000)' }}>
                Accent
              </p>
              <p className="text-xs opacity-60" style={{ fontWeight: 400, color: 'var(--color-base-content, #000)' }}>
                --color-accent
              </p>
            </div>
            <div className="text-center">
              <div
                className="h-24 mb-3 border-2"
                style={{ 
                  backgroundColor: 'var(--color-base-100, #F5F5FC)',
                  borderColor: 'var(--color-primary, #6233FF)',
                  borderRadius: cornerRadius,
                }}
              ></div>
              <p className="text-sm font-semibold" style={{ fontWeight: 600, color: 'var(--color-base-content, #000)' }}>
                Background
              </p>
              <p className="text-xs opacity-60" style={{ fontWeight: 400, color: 'var(--color-base-content, #000)' }}>
                --color-base-100
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Brand Info - Logos Tab */}
        {activeTab === 'logos' && (
        <div
          className="p-8 border-2 mb-12"
          style={{
            borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
            backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
            borderRadius: cornerRadius,
          }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{ fontWeight: 700 }}>
            Brand Color System
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(brandColors).map(([name, hex]) => (
              <div key={name} className="text-center">
                <div
                  className="h-16 mb-2 border-2"
                  style={{ 
                    backgroundColor: hex,
                    borderColor: name === 'ghostWhite' ? '#ddd' : 'transparent',
                    borderRadius: cornerRadius,
                  }}
                ></div>
                <p className="text-sm font-semibold capitalize" style={{ fontWeight: 600 }}>
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-xs opacity-60" style={{ fontWeight: 400 }}>
                  {hex}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ fontWeight: 500 }}>
            These colors represent the balance between creativity and professionalism. The bold, energetic tones reflect
            innovation, expression, and artistic freedom, while the neutral foundation reinforces trust, clarity, and
            reliability.
          </p>
        </div>
        )}

        {/* Typography Sample - Logos Tab */}
        {activeTab === 'logos' && (
        <div
          className="p-8 border-2"
          style={{
            borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
            backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
            borderRadius: cornerRadius,
          }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ fontWeight: 700 }}>
            Manrope Typography
          </h3>
          <div className="space-y-4">
            <p style={{ fontSize: '18px', fontWeight: 400 }}>Regular (400) - Clean geometric forms</p>
            <p style={{ fontSize: '18px', fontWeight: 500 }}>Medium (500) - Enhanced readability</p>
            <p style={{ fontSize: '18px', fontWeight: 600 }}>Semibold (600) - Visual hierarchy</p>
            <p style={{ fontSize: '18px', fontWeight: 700 }}>Bold (700) - Strong emphasis</p>
            <p style={{ fontSize: '18px', fontWeight: 800 }}>Extrabold (800) - Maximum impact</p>
          </div>
        </div>
        )}
        {/* Brand Guidelines Tab */}
        {activeTab === 'guidelines' && (
        <div className="space-y-8">
          {/* Vision & Mission */}
          <div
            className="p-8 border-2"
            style={{
              borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
              backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
              borderRadius: cornerRadius,
            }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ fontWeight: 700 }}>
              Our Mission & Vision
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ fontWeight: 600 }}>Mission</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  Remove the barriers that stand between artists and opportunity by building the business infrastructure 
                  that creatives have always deserved. Through professional portfolios, integrated commerce, marketing and 
                  CRM tools, event management, education, and collaborative resources, we empower artists to spend less 
                  time managing a business and more time creating.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ fontWeight: 600 }}>Vision</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  A world where creative careers are sustainable, collaboration is effortless, and every artist has 
                  access to the resources needed to thrive. An ecosystem where creativity is valued as a profession, 
                  artists are empowered as entrepreneurs, and art becomes more accessible to the people who appreciate 
                  and support it.
                </p>
              </div>
            </div>
          </div>

          {/* Logo System */}
          <div
            className="p-8 border-2"
            style={{
              borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
              backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
              borderRadius: cornerRadius,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ fontWeight: 700 }}>
              Logo System & Symbolism
            </h3>
            <div className="space-y-4">
              <p style={{ fontWeight: 500 }}>
                <strong>The 'Stylized Nodes'</strong> represent the intersection of creativity, collaboration, and growth. 
                The fluid interconnected form symbolizes artists from every discipline coming together to build a stronger 
                creative ecosystem.
              </p>
              <p style={{ fontWeight: 500 }}>
                <strong>Filled Mark</strong> (Standard): High contrast usage. Maintains the bold symbolism of unity with solid 
                visual weight.
              </p>
              <p style={{ fontWeight: 500 }}>
                <strong>Hollow Mark</strong> (Clearspace): Represents openness, connection, and possibility. The outlined form 
                emphasizes collaboration, accessibility, and the ever-evolving nature of the creative community.
              </p>
            </div>
          </div>

          {/* Design System */}
          <div
            className="p-8 border-2"
            style={{
              borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
              backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
              borderRadius: cornerRadius,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ fontWeight: 700 }}>
              Design System Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ fontWeight: 600 }}>Soft Corners (Border Radius)</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  All UI elements use <strong>24px border radius</strong> for soft, modern corners. This creates a 
                  contemporary aesthetic that feels welcoming and approachable while maintaining visual hierarchy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ fontWeight: 600 }}>High-Contrast Logo Pairings</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  Primary logo system maintains solid light or dark variations against TAG's core brand colors to ensure 
                  maximum legibility, consistency, and brand recognition across digital and physical applications.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ fontWeight: 600 }}>Typography Foundation</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  <strong>Manrope</strong> font family by Mikhail Sharanda. For consistency and optimal legibility, web 
                  applications should be limited to: Regular, Medium, Semibold, and Bold weights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ fontWeight: 600 }}>Color Implementation</h4>
                <p style={{ fontWeight: 500, lineHeight: '1.6' }}>
                  Dark surfaces provide comfortable reading experience. Vibrant accent colors naturally draw attention to 
                  key actions. The consistent palette establishes recognizable visual identity across every page and device.
                </p>
              </div>
            </div>
          </div>

          {/* Application Guidelines */}
          <div
            className="p-8 border-2"
            style={{
              borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
              backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
              borderRadius: cornerRadius,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ fontWeight: 700 }}>
              Application Guidelines
            </h3>
            <ul className="space-y-3">
              <li style={{ fontWeight: 500 }}>✓ Maintain high contrast between logo and background</li>
              <li style={{ fontWeight: 500 }}>✓ Use soft corners (24px radius) consistently across UI components</li>
              <li style={{ fontWeight: 500 }}>✓ Apply brand colors intentionally for maximum visual impact</li>
              <li style={{ fontWeight: 500 }}>✓ Reserve Manrope ExtraLight, Light, and ExtraBold for special cases only</li>
              <li style={{ fontWeight: 500 }}>✓ Use Chartreuse (#CEFF1D) for highlights and CTAs to draw attention</li>
              <li style={{ fontWeight: 500 }}>✓ Implement Ghost White (#F5F5FC) for accessible light backgrounds and accents</li>
              <li style={{ fontWeight: 500 }}>✓ Keep design cohesive across every touchpoint and device</li>
            </ul>
          </div>

          {/* Brand Values */}
          <div
            className="p-8 border-2"
            style={{
              borderColor: currentStyle.border.includes('CEFF1D') ? '#CEFF1D' : '#6233FF',
              backgroundColor: selectedStyle === 'indigo' ? 'rgba(98, 51, 255, 0.05)' : selectedStyle === 'chartreuse' ? 'rgba(206, 255, 29, 0.05)' : 'rgba(245, 245, 252, 0.05)',
              borderRadius: cornerRadius,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ fontWeight: 700 }}>
              Core Brand Identity
            </h3>
            <p style={{ fontWeight: 500, lineHeight: '1.8', marginBottom: '1rem' }}>
              TAG's visual identity reflects the balance between creative expression and professional infrastructure. 
              The modern typography and contemporary design language communicate that TAG is built by artists who understand 
              the realities of the creative industry.
            </p>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              A platform made for artists, by artists. Building business solutions is our art.
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
