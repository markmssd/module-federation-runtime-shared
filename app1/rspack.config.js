const rspack = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const path = require('path');

const OUTPUT_PATH = path.resolve(process.cwd(), './dist');

module.exports = {
  entry: {
    app: [
      './src/index.js',
    ],
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    pathinfo: false,
    uniqueName: 'app1',
  },
  optimization: {
    moduleIds: 'named',
    runtimeChunk: 'single',
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
    ],
  },
  stats: {
    assets: false,
    colors: true,
  },
  plugins: [
    // if you comment out this plugin, the error will NOT happen
    new ModuleFederationPlugin({
      name: 'app1',
      manifest: false,
      dts: false,
      dev: false,
      // adds react as shared module
      // version is inferred from package.json
      // there is no version check for the required version
      // so it will always use the higher version found
      shared: {
        react: {
          import: 'react', // the "react" package will be used a provided and fallback module
          shareKey: 'react', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
          requiredVersion: '18.3.1',
        },
        // trailing slash is important when importing from react-dom/client
        // with React 18 to avoid warnings in production mode. In dev, it works with or without it
        'react-dom/': {
          singleton: true, // only a single version of the shared module is allowed
          requiredVersion: '18.3.1',
        },
      },
    }),
    new rspack.HtmlRspackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
    new ReactRefreshPlugin({
      overlay: true,
    }),
  ]
};
