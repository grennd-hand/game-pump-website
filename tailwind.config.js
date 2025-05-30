/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
        'retro': ['Orbitron', 'monospace'],
      },
      colors: {
        // 怀旧游戏配色方案
        'retro': {
          'green': '#00FF00',
          'cyan': '#00FFFF', 
          'yellow': '#FFFF00',
          'magenta': '#FF00FF',
          'red': '#FF0040',
          'blue': '#0080FF',
          'orange': '#FF8000',
        },
        'neon': {
          'green': '#39FF14',
          'blue': '#1B03A3',
          'pink': '#FF073A',
          'purple': '#BF00FF',
        },
        'dark': {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
        },
        'retro-green': '#00FF00',
        'retro-cyan': '#00FFFF', 
        'retro-magenta': '#FF00FF',
        'retro-yellow': '#FFFF00',
        'retro-orange': '#FF8800',
        'retro-red': '#FF0000',
        'retro-blue': '#0088FF'
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 3s ease-in-out infinite',
        'pixel-move': 'pixelMove 0.3s ease-out',
        'scan-lines': 'scan-lines 0.1s linear infinite',
        'pixel-bounce': 'pixel-bounce 1.4s ease-in-out infinite both',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          'to': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' }
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pixelMove: {
          '0%': { transform: 'translateX(-2px)' },
          '100%': { transform: 'translateX(0px)' }
        },
        'scan-lines': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' }
        },
        'pixel-bounce': {
          '0%, 80%, 100%': {
            transform: 'scale(0)',
            opacity: '0.5'
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        }
      },
      backgroundImage: {
        'gradient-retro': 'linear-gradient(45deg, #00FF00, #00FFFF, #FF00FF)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pixel-pattern': "url('data:image/svg+xml,<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"a\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><rect width=\"40\" height=\"40\" fill=\"%23000\"/><rect width=\"2\" height=\"2\" fill=\"%23333\" x=\"0\" y=\"0\"/><rect width=\"2\" height=\"2\" fill=\"%23333\" x=\"20\" y=\"20\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23a)\"/></svg>')",
      }
    },
  },
  plugins: [],
} 