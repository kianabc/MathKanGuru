import { motion } from 'framer-motion'

interface KangarooMascotProps {
  size?: number
  mood?: 'happy' | 'thinking' | 'celebrating'
  className?: string
}

export default function KangarooMascot({ size = 120, mood = 'happy', className = '' }: KangarooMascotProps) {
  const bounce = mood === 'celebrating'
    ? { y: [0, -20, 0] }
    : mood === 'thinking'
    ? { rotate: [0, -5, 5, 0] }
    : { y: [0, -8, 0] }

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={bounce}
      transition={{
        duration: mood === 'celebrating' ? 0.6 : 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="100" cy="130" rx="45" ry="55" fill="#F97316" />
        {/* Belly */}
        <ellipse cx="100" cy="140" rx="30" ry="38" fill="#FFEDD5" />
        {/* Head */}
        <circle cx="100" cy="65" r="35" fill="#F97316" />
        {/* Inner face */}
        <circle cx="100" cy="68" r="26" fill="#FFEDD5" />
        {/* Eyes */}
        <circle cx="88" cy="60" r="5" fill="#1a1a2e" />
        <circle cx="112" cy="60" r="5" fill="#1a1a2e" />
        {/* Eye sparkle */}
        <circle cx="90" cy="58" r="2" fill="white" />
        <circle cx="114" cy="58" r="2" fill="white" />
        {/* Nose */}
        <ellipse cx="100" cy="70" rx="4" ry="3" fill="#C2410C" />
        {/* Smile */}
        <path
          d={mood === 'celebrating'
            ? "M 88 78 Q 100 92 112 78"
            : mood === 'thinking'
            ? "M 92 80 Q 100 82 108 80"
            : "M 88 78 Q 100 88 112 78"
          }
          stroke="#C2410C"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Ears */}
        <ellipse cx="75" cy="40" rx="10" ry="18" fill="#F97316" />
        <ellipse cx="75" cy="40" rx="6" ry="12" fill="#FFCDA8" />
        <ellipse cx="125" cy="40" rx="10" ry="18" fill="#F97316" />
        <ellipse cx="125" cy="40" rx="6" ry="12" fill="#FFCDA8" />
        {/* Arms */}
        <ellipse cx="60" cy="120" rx="10" ry="22" fill="#F97316" transform="rotate(20, 60, 120)" />
        <ellipse cx="140" cy="120" rx="10" ry="22" fill="#F97316" transform="rotate(-20, 140, 120)" />
        {/* Legs */}
        <ellipse cx="80" cy="180" rx="18" ry="10" fill="#F97316" />
        <ellipse cx="120" cy="180" rx="18" ry="10" fill="#F97316" />
        {/* Tail */}
        <path
          d="M 145 160 Q 170 145 160 120"
          stroke="#F97316"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Math hat */}
        <rect x="78" y="28" width="44" height="8" rx="4" fill="#14B8A6" />
        <rect x="88" y="12" width="24" height="20" rx="4" fill="#14B8A6" />
        <text x="100" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">+</text>
      </svg>
    </motion.div>
  )
}
