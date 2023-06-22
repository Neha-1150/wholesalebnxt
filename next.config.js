const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
	// other next config
	reactStrictMode: true,
	pwa: {
		dest: 'public',
		sw: '/sw.js',
		register: true,
		skipWaiting: true,
		runtimeCaching,
		buildExcludes: [/middleware-manifest.json$/],
	},
	images: {
		domains: ['bnxtcdn.sgp1.digitaloceanspaces.com'],
	},
});
