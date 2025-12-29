/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Text',
                    'Helvetica Neue',
                    'Helvetica',
                    'Arial',
                    'sans-serif'
                ],
                'sf-pro-text': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                'sf-pro-display': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                'apple-text': '#1d1d1f',
                'apple-bg': '#fff',
                'apple-link': '#0066cc',
                'apple-nav-bg': 'rgba(0, 0, 0, 0.8)',
                'apple-nav-text': '#f5f5f7',
            }
        },
    },
    plugins: [],
}
