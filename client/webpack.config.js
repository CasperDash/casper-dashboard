const path = require('path');
const util = require('util');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { productionConfig, extensionConfig, devConfig, webConfig } = require('./webpack');

const requireEnvConfigFile = (network) => {
	let configFile;
	switch (network) {
		case 'mainnet':
			configFile = '.env.production.local';
			break;
		case 'testnet':
			configFile = '.env.staging.local';
			break;
		default:
			configFile = '.env.development.local';
			break;
	}
	require('dotenv').config({ path: path.resolve(__dirname, configFile) });
};

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const isWeb = env.type !== 'extension';
	requireEnvConfigFile(env.network);

	const custom = env.showAnalyzer ? { plugins: [new BundleAnalyzerPlugin()] } : {};

	const evnConfig = isProduction ? productionConfig : devConfig(isWeb);
	const getTypeConfig = isWeb ? webConfig : extensionConfig;
	const typeConfig = getTypeConfig(__dirname);
	const finalConfig = merge(typeConfig, evnConfig, custom);

	console.info(util.inspect(finalConfig, false, null, true));
	return finalConfig;
};
