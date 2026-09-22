interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const iconSizes = {
  sm: 'w-7 h-7 rounded-lg',
  md: 'w-9 h-9 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
  xl: 'w-16 h-16 rounded-3xl',
}

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

function EqualizerIcon({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <div
      className={`bg-[#0e6f5c] flex items-center justify-center shadow-md shadow-[#0e6f5c]/25 shrink-0 ${iconSizes[size]}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 text-white"
      >
        {/* 5 rounded vertical equalizer bars */}
        <rect x="7" y="18" width="4.5" height="12" rx="2.25" fill="currentColor" />
        <rect x="15" y="10" width="4.5" height="28" rx="2.25" fill="currentColor" />
        <rect x="23" y="6" width="4.5" height="36" rx="2.25" fill="currentColor" />
        <rect x="31" y="10" width="4.5" height="28" rx="2.25" fill="currentColor" />
        <rect x="39" y="18" width="4.5" height="12" rx="2.25" fill="currentColor" />
      </svg>
    </div>
  )
}

export function Logo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <EqualizerIcon size={size} />
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <EqualizerIcon size={size} />
        <div className="mt-3">
          <span className={`font-black tracking-tight text-[#161925] dark:text-white ${textSizes[size]}`}>
            StageFlow
          </span>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide">
            Gestão de bandas e eventos
          </p>
        </div>
      </div>
    )
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <EqualizerIcon size={size} />
      <div className="flex flex-col">
        <span className={`font-black tracking-tight leading-none text-[#161925] dark:text-white ${textSizes[size]}`}>
          StageFlow
        </span>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
          Gestão de bandas e eventos
        </span>
      </div>
    </div>
  )
}
