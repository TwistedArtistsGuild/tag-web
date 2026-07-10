import Image from 'next/image'

/**
 * ThemeLogo component - Displays a logo with theme-compliant drop shadow
 * @param {Object} props
 * @param {string} props.src - Image source path
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.width - Container width class (e.g., 'w-32', 'w-48')
 * @param {string} props.height - Container height class (e.g., 'h-12', 'h-14')
 * @returns {JSX.Element}
 */
export default function ThemeLogo({ src, alt, width = 'w-32', height = 'h-12' }) {
  return (
    <div className={`relative ${width} ${height} flex-shrink-0`} style={{
      filter: 'drop-shadow(0 1px 3px rgba(21, 19, 24, 0.6)) drop-shadow(0 4px 12px color-mix(in srgb, var(--color-primary, #6233FF) 85%, transparent))'
    }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
