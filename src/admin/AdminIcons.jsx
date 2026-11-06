const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const PlusIcon = () => <svg {...base} strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
export const UpIcon = () => <svg {...base} strokeWidth="2.6"><path d="M6 15l6-6 6 6" /></svg>
export const DownIcon = () => <svg {...base} strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
export const LeftIcon = () => <svg {...base} strokeWidth="2.6"><path d="M15 18l-6-6 6-6" /></svg>
export const RightIcon = () => <svg {...base} strokeWidth="2.6"><path d="M9 18l6-6-6-6" /></svg>
export const TrashIcon = () => (
  <svg {...base} strokeWidth="2.2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
)
export const ExternalIcon = () => (
  <svg {...base} strokeWidth="2.2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
)
export const LogoutIcon = () => (
  <svg {...base} strokeWidth="2.2"><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" /></svg>
)
export const OkIcon = () => <svg {...base} strokeWidth="2.8"><path d="M5 12l5 5L20 7" /></svg>
export const AlertIcon = () => (
  <svg {...base} strokeWidth="2.4"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
)
export const EyeIcon = () => (
  <svg {...base} strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
)
export const EyeOffIcon = () => (
  <svg {...base} strokeWidth="2"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
)
