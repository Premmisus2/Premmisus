/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./index.tsx",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#05070A', // Deep Black
                surface: '#0D1117', // Darker Surface
                border: '#262626',
                accent: '#00F0FF', // Cyan
                'accent-blue': '#0072FF', // Blue
                'text-primary': '#FFFFFF',
                'text-secondary': '#A3A3A3',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                body: ['Roboto', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'blob': 'blob 10s infinite',
                'beam': 'beam 2s linear infinite',
                marquee: 'marquee var(--duration) infinite linear',
                'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                beam: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(calc(-100% - var(--gap)))' },
                },
                'marquee-vertical': {
                    from: { transform: 'translateY(0)' },
                    to: { transform: 'translateY(calc(-100% - var(--gap)))' },
                }
            }
        },
    },
    plugins: [],
}
