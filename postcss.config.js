const AUTOPREFIXER_BROWSERS = 'last 2 versions';

module.exports = {
	plugins: [
		require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS })
	]
}
