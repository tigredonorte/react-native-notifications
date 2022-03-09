module.exports = function(api) {
  api.cache(true);
  return {
    presets: [ 'babel-preset-expo' ],
    plugins: [
      [
        'module-resolver', {
          root: [ './' ],
          alias: {
            '^~(.+)': './src/\\1', // All paths starting with ~ will be replaced with ./src/
          }
        }
      ],
      [
        'module:react-native-dotenv', {
          'moduleName': '@env',
          'path': '.env',
          'blocklist': null,
          'allowlist': null,
          'safe': true,
          'allowUndefined': true
        }
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
