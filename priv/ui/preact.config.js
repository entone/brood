/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
  if(process.env.NODE_ENV != 'development'){
    config.output.publicPath = '/build/';
  }
  config.resolve.alias['react'] = 'preact-compat';
  config.resolve.alias['react-dom'] = 'preact-compat';
  return config;
}
