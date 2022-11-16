import { Configuration } from 'webpack';
import NodemonPlugin from 'nodemon-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default (env: { [k: string]: string | boolean }): Configuration => {
  const isDev = env.mode === 'dev';
  const isInspect = !!env.inspect;
  const nodemonAutoRestart = !!env.auto_rs;

  return {
    mode: isDev ? 'development' : 'production',
    entry: {
      index: './src/index',
    },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: ['babel-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '...'],
    },
    target: 'node',
    watch: !!isDev,
    devtool: isDev ? 'inline-source-map' : false,
    plugins: [
      new NodemonPlugin({
        nodeArgs: isInspect ? ['--inspect'] : [],
        ignoreRoot: nodemonAutoRestart ? [] : ['./'],
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    externals: [nodeExternals()],
    output: {
      clean: true,
    },
  };
};
