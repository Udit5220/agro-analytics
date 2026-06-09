/**
 * UI Configuration & Shared Style Constants for AgroIndia
 * Manages global UI flags, standard layout classes, animations, and typography tokens.
 */
export const uiConfig = {
  // Global App metadata
  appName: 'AgroIndia',
  appTagline: 'AI-Powered Agriculture Platform',

  // UI Theme Configuration
  theme: {
    colors: {
      brandDarkest: '#132a13',
      brandDark: '#31572c',
      brandMedium: '#4f772d',
      brandLight: '#90a955',
      brandAccent: '#ecf39e',
      brandLightest: '#f4f7f4',
    }
  },

  // Layout standardizations
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    sectionPadding: 'py-20 lg:py-28',
    sectionPaddingCompact: 'py-12 lg:py-16',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
  },

  // Premium transitions & micro-animations
  transitions: {
    default: 'transition-all duration-300 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
    hoverScale: 'hover:scale-[1.02] active:scale-[0.98]',
    hoverLift: 'hover:-translate-y-1 hover:shadow-xl',
  },

  // Interactive styling standards
  styles: {
    card: 'bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300',
    cardInteractive: 'bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer',
    glass: 'backdrop-blur-md bg-white/70 dark:bg-brand-darkest/70 border border-white/20',
    badge: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase',
    buttonPrimary: 'px-6 py-3 rounded-xl bg-brand-medium text-white font-medium hover:bg-brand-dark transition-all duration-300 hover:shadow-lg hover:shadow-brand-medium/20 active:scale-[0.98]',
    buttonAccent: 'px-6 py-3 rounded-xl bg-brand-accent text-brand-darkest font-semibold hover:bg-white hover:text-brand-darkest transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/20 active:scale-[0.98]',
    buttonOutline: 'px-6 py-3 rounded-xl border-2 border-brand-light/30 text-white font-medium hover:border-brand-accent hover:text-brand-accent transition-all duration-300 active:scale-[0.98]',
  },

  // Global visual flags
  flags: {
    enableAnimations: true,
    enableThemeToggle: true,
    enableNotifications: true,
  }
};
