/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root",
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#0F9EE1",
          "primary-content": "#ffffff",
          "neutral": "#878787",
          "base-100": "#ffffff",
          "base-200": "#F4F4F5",
          "base-content": "#1A1A1A",
          "info": "#3479E9",
          "success": "#18B451",
          "warning": "#D9A508",
          "error": "#EF4343",
          },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#0F9EE1",
          "primary-content": "#ffffff",
          "accent": "#0F9EE1",
          "neutral": "#878787",
          "base-100": "#1A1A1A",
          "base-200": "#27272A",
          "base-300": "#3F3F46",
          "base-content": "#ffffff",
          "info": "#3479E9",
          // "info-content": "#001616",
          "success": "#18B451",
          // "success-content": "#000800",
          "warning": "#D9A508",
          // "warning-content": "#0f0200",
          "error": "#EF4343",
          // "error-content": "#160002",
        },
        black: {
          ...require("daisyui/src/theming/themes")["black"],
          "primary": "#ffffff",
          "primary-content": "#000000",
        },
        coffee: {
          ...require("daisyui/src/theming/themes")["coffee"],
          "neutral": "#878787",
        },
        },
        "black",
        "coffee",
        "valentine"
      ],
    },
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        // => @media (min-width: 375px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
        'md': '768px',
        // => @media (min-width: 768px) { ... }
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
        '2xl': '1440px',
        // => @media (min-width: 1440px) { ... }
      }
    },
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui'), require('tailwind-scrollbar-hide')],
}

