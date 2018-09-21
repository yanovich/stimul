var path = require('path');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('./config/paths');
const config = require('./config/webpack.config.dev');
const express = require('express');

const compiler = webpack(config);
const app = express();

if (process.env.NODE_ENV === 'development')
  app.use(middleware(compiler, {
    color: true
  }));
else if (process.env.NODE_ENV === 'production')
  app.use(express.static(path.join(__dirname, 'build/')));
else
  process.exit(1);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
