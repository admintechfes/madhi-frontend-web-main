module.exports = {
	content: ['./src/**/*.{js,jsx}', './public/index.html'],
	// important: true,
	prefix: 'tw-',
	theme: {
		extend: {
			colors: {
				primary:"#FFC40C",
				secondary:"#F39C35",
				primaryText:"#666666",
				secondaryText:"#222222",
				backgroundGrey: '#FAFCFE',
				backgroundDarkGrey:"#F7F7F7",
				backgroundPrimary:"rgba(255, 196, 12, 0.24)",
				backgroundBody:'#FAFAFA',
				grey:'#999999',
				error:"#EB5757",
				lightGrey:"#FBFBFB"
			},
			fontFamily: {
				roboto: ['roboto', 'sans-serif'],
				robotoBold: ['roboto-bold', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
