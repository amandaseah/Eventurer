/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: { 
      extend: {
        // Extend container sizes for better screen utilization
        screens: {
          'sm': '640px',
          'md': '768px', 
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1400px',
          '3xl': '1600px',
          '4xl': '1920px',
        },
        // Custom container configuration
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
            '2xl': '6rem',
          },
          screens: {
            sm: '100%',
            md: '100%', 
            lg: '1024px',
            xl: '1280px',
            '2xl': '1400px',
            '3xl': '1600px',
            '4xl': '1800px',
          }
        }
      } 
    },
    plugins: [],
  };