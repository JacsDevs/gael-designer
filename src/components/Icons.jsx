const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const InstagramIcon = () => (
  <svg {...base} strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" />
  </svg>
)

export const ChatIcon = () => (
  <svg {...base} strokeWidth="2.4">
    <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" />
  </svg>
)

export const CheckIcon = ({ color = '#F2C14E', width = 3 }) => (
  <svg {...base} stroke={color} strokeWidth={width}>
    <path d="M5 12l5 5L20 7" />
  </svg>
)

export const ArrowRightIcon = () => (
  <svg {...base} strokeWidth="2.8">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = () => (
  <svg {...base} strokeWidth="2.6">
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

export const ChevronLeftIcon = () => (
  <svg {...base} strokeWidth="2.6">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const ChevronRightIcon = () => (
  <svg {...base} strokeWidth="2.6">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export const ImageIcon = () => (
  <svg {...base} strokeWidth="2.4">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="9" cy="9" r="1.6" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export const MenuIcon = () => (
  <svg {...base} strokeWidth="2.4">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base} strokeWidth="2.4">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
