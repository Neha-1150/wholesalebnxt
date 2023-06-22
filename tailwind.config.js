const defaultTheme = require('tailwindcss/defaultTheme');
const themeColors = require('tailwindcss/colors');
delete themeColors.lightBlue;
const brandColor = themeColors.cyan;
const darkerColor = themeColors.gray;

module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '2rem',
					xl: '5rem',
					'2xl': '6rem',
				},
			},
			colors: {
				...themeColors,
				// brand: {
				// 	50: brandColor[50],
				// 	100: brandColor[100],
				// 	200: brandColor[200],
				// 	300: brandColor[300],
				// 	400: brandColor[400],
				// 	500: brandColor[500],
				// 	600: brandColor[600],
				// 	700: brandColor[700],
				// 	800: brandColor[800],
				// 	900: brandColor[900],
				// },
				brand: {
					50: '#ffdfd3',
					100: '#ffbaa0',
					200: '#ffa886',
					300: '#ff956d',
					400: '#ff8353',
					500: '#FF5E20', // Brand Color
					600: '#ec4200',
					700: '#d33b00',
					800: '#b93300',
					900: '#862500',
				},
				darkColor: {
					50: darkerColor[50],
					100: darkerColor[100],
					200: darkerColor[200],
					300: darkerColor[300],
					400: darkerColor[400],
					500: darkerColor[500],
					600: darkerColor[600],
					700: darkerColor[700],
					800: darkerColor[800],
					900: darkerColor[900],
				},
			},
			fontFamily: {
				inter: ['Inter, sans-serif', ...defaultTheme.fontFamily.sans],
				gilroy: ['Gilroy, sans-serif', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: {
			dropShadow: ['hover', 'focus'],
			opacity: ['disabled'],
		},
	},
	zIndex: {
		0: 0,
		10: 10,
		20: 20,
		30: 30,
		40: 40,
		50: 50,
		25: 25,
		50: 50,
		75: 75,
		100: 100,
		auto: 'auto',
	},

	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio'), require('tailwind-scrollbar-hide')],
};