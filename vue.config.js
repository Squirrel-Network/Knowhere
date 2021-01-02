/** @type import('@vue/cli-service').ProjectOptions */

module.exports = {
	publicPath: '/knowhere',

	// https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
	chainWebpack(config) {
		// config.devtool('source-map');

		config.plugin('html')
			.tap(args => {
				args[0].title = 'Knowhere';
				args[0].base = '/knowhere';

				return args;
			});
	}
}