/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      colors: {
        // Primary brand colors
        primary: '#0A6EF0',
        'primary-600': '#0A58D6',
        'primary-50': '#EBF5FF',
        'primary-100': '#D6EBFF',
        
        // Background colors
        'background-light': '#F6F7F8',
        'background-dark': '#0D1117',
        
        // Surface colors
        'surface-light': '#FFFFFF',
        'surface-dark': '#161B22',
        
        // Text colors
        'text-main': '#0D141B',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        
        // Border colors
        'border-light': '#E5E7EB',
        'border-dark': '#30363D',
        'border-color': '#E5E7EB',
        
        // Input colors
        'input-bg': '#F3F4F6',
        'input-border': '#D1D5DB',
        
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '8px',
        button: '8px',
        input: '8px',
        modal: '12px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 8px 24px rgba(0,0,0,0.06)',
        lg: '0 16px 48px rgba(0,0,0,0.08)',
        card: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)',
        dropdown: '0 10px 40px rgba(0,0,0,0.1)',
        modal: '0 25px 50px -12px rgba(0,0,0,0.25)'
      },
      transitionDuration: {
        fast: '120ms',
        medium: '200ms',
        slow: '300ms'
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        spin: 'spin 1s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}
