type IconProps = { size?: number; stroke?: number }

const base = (props: IconProps) => ({ width: props.size ?? 20, height: props.size ?? 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: props.stroke ?? 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })

export function HomeIcon(props: IconProps) { return <svg {...base(props)}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg> }
export function MicIcon(props: IconProps) { return <svg {...base(props)}><rect x="8" y="3" width="8" height="12" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></svg> }
export function UserIcon(props: IconProps) { return <svg {...base(props)}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg> }
export function PlayIcon(props: IconProps) { return <svg {...base(props)} fill="currentColor" stroke="none"><path d="M8 5.7c0-1.1 1.2-1.8 2.2-1.2l8.6 5.3c1 .6 1 2 0 2.5l-8.6 5.3C9.2 18.2 8 17.5 8 16.3z" /></svg> }
export function PauseIcon(props: IconProps) { return <svg {...base(props)} fill="currentColor" stroke="none"><path d="M7 5.5A1.5 1.5 0 0 1 8.5 4h1A1.5 1.5 0 0 1 11 5.5v13A1.5 1.5 0 0 1 9.5 20h-1A1.5 1.5 0 0 1 7 18.5zM13 5.5A1.5 1.5 0 0 1 14.5 4h1A1.5 1.5 0 0 1 17 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z" /></svg> }
export function HeartIcon(props: IconProps) { return <svg {...base(props)}><path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" /></svg> }
export function ClockIcon(props: IconProps) { return <svg {...base(props)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg> }
export function MoreIcon(props: IconProps) { return <svg {...base(props)}><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></svg> }
export function ArrowIcon(props: IconProps) { return <svg {...base(props)}><path d="M5 12h13M13 6l6 6-6 6" /></svg> }
export function BackIcon(props: IconProps) { return <svg {...base(props)}><path d="m15 18-6-6 6-6" /></svg> }
export function SparkIcon(props: IconProps) { return <svg {...base(props)}><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></svg> }
export function MoonIcon(props: IconProps) { return <svg {...base(props)}><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.4 8.5 8.5 0 1 0 20.5 15.5Z" /></svg> }
export function SettingsIcon(props: IconProps) { return <svg {...base(props)}><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" /><path d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .5v.2a1.8 1.8 0 1 1-3.6 0V18a1.8 1.8 0 0 0-3-.5l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.5-3H4.1a1.8 1.8 0 1 1 0-3.6h.2a1.8 1.8 0 0 0 .5-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.5V2.3a1.8 1.8 0 1 1 3.6 0v.2a1.8 1.8 0 0 0 3 .5l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .5 3h.2a1.8 1.8 0 1 1 0 3.6h-.2a1.8 1.8 0 0 0-.5 2.9Z" /></svg> }
export function ChevronIcon(props: IconProps) { return <svg {...base(props)}><path d="m9 5 7 7-7 7" /></svg> }
export function RefreshIcon(props: IconProps) { return <svg {...base(props)}><path d="M20 11a8 8 0 1 0 1 4M20 5v6h-6" /></svg> }
