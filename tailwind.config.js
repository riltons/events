/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B35",
          foreground: "#FFFFFF",
          50: "#FFF4F0",
          100: "#FFE8E0",
          200: "#FFD1C1",
          300: "#FFBA9D",
          400: "#FF8B5A",
          500: "#FF6B35",
          600: "#E85A2A",
          700: "#C7481F",
          800: "#A63818",
          900: "#8B2F15",
        },
        secondary: {
          DEFAULT: "#004E89",
          foreground: "#FFFFFF",
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#BAD9FF",
          300: "#7CB8FF",
          400: "#3692FF",
          500: "#0A6EFF",
          600: "#004E89",
          700: "#003D6B",
          800: "#002C4D",
          900: "#001F35",
        },
        accent: {
          DEFAULT: "#FFD23F",
          foreground: "#1F1F1F",
          50: "#FFFDF0",
          100: "#FFFAE0",
          200: "#FFF4C1",
          300: "#FFED9D",
          400: "#FFE66B",
          500: "#FFD23F",
          600: "#E8BC00",
          700: "#C7A000",
          800: "#A68400",
          900: "#8B6F00",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      fontFamily: {
        'sans': ['Open Sans', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'system-ui', 'sans-serif'],
        'accent': ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FF6B35 0%, #004E89 50%, #FFD23F 100%)',
        'card-gradient': 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 