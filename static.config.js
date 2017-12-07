// Paths Aliases defined through tsconfig.json

// const typescriptWebpackPaths = require('./webpack.config.js');

import { siteProps, getRoutes, Document, webpackConfig } from './src/setup';

const sponsors = require("./json/_static/sponsors/sponsors.json");
const context = require("./json/globalcontext.json");

export default {
  getSiteProps: siteProps,
  //siteRoot: "http://book.xogeny.com",
  siteRoot: "/",
  getRoutes: getRoutes(__dirname, sponsors, context),
  // renderToHtml: (render, Component, meta) => {
  //   return render(<Component />);
  // },
  Document: Document(context),
  webpack: webpackConfig,
}
