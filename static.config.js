// Paths Aliases defined through tsconfig.json

// const typescriptWebpackPaths = require('./webpack.config.js');

import { siteProps, getRoutes, Document, webpackConfig } from './src/setup';

export default {
  getSiteProps: siteProps,
  //siteRoot: "http://book.xogeny.com",
  siteRoot: "/",
  getRoutes: getRoutes(__dirname),

  // renderToHtml: (render, Component, meta) => {
  //   return render(<Component />);
  // },

  Document: Document,

  webpack: webpackConfig,
}
