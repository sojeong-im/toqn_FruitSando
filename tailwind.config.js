/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F4ECE0',
          300: '#EDE0CC',
        },
        sando: {
          bread: '#E9CBA7',
          crust: '#B87B44',
          cream: '#FFFDF9',
          strawberry: '#FF4D6D',
          shine: '#80ED99',
          mango: '#FFAA00',
          tangerine: '#FF7B00',
          blueberry: '#6A4C93',
          kiwi: '#52B788'
        }
      },
      fontFamily: {
        game: ['"Pretendard"', 'sans-serif'],
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-4deg) scale(1.04)' },
          '75%': { transform: 'rotate(4deg) scale(1.04)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slash: {
          '0%': { transform: 'scaleX(0) rotate(-45deg)', opacity: '0' },
          '50%': { transform: 'scaleX(1.4) rotate(-45deg)', opacity: '1' },
          '100%': { transform: 'scaleX(1.8) rotate(-45deg)', opacity: '0' },
        },
        splitLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '100%': { transform: 'translateX(-38px) rotate(-6deg)' }
        },
        splitRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '100%': { transform: 'translateX(38px) rotate(6deg)' }
        },
        magicPop: {
          '0%': { transform: 'scale(0.5) rotate(-10deg)', opacity: '0', filter: 'brightness(2) drop-shadow(0 0 30px rgba(251,191,36,0.9))' },
          '60%': { transform: 'scale(1.12) rotate(4deg)', opacity: '1', filter: 'brightness(1.3) drop-shadow(0 0 20px rgba(251,191,36,0.6))' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1', filter: 'brightness(1)' }
        },
        sparkleFloat: {
          '0%': { transform: 'translateY(10px) scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'translateY(-15px) scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'translateY(-35px) scale(0.6) rotate(360deg)', opacity: '0' }
        },
        haloPulse: {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.4' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' }
        }
      },
      animation: {
        wobble: 'wobble 0.6s ease-in-out infinite',
        popIn: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        slash: 'slash 0.5s ease-out forwards',
        splitLeft: 'splitLeft 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        splitRight: 'splitRight 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        magicPop: 'magicPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        sparkleFloat: 'sparkleFloat 1.2s ease-out infinite',
        haloPulse: 'haloPulse 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
