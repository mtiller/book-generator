import axios from 'axios'

// Paths Aliases defined through tsconfig.json
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const typescriptWebpackPaths = require('./webpack.config.js')

const root = require('./json/index.json');

let results = cp.execSync('find . -name "*.fjson" -print');
let pages = results.toString().split("\n").filter((f) => f.length > 7).map((f) => f.slice(7));

let map = {};
for (let i = 0; i < pages.length; i++) {
  let page = pages[i];
  let file = path.join(".", "json", page);
  map[page] = JSON.parse(fs.readFileSync(file).toString());
}

export default {
  getSiteProps: () => ({
    title: 'React Static',
  }),
  getRoutes: () => {
    let root = {
      path: '/',
      component: 'src/containers/Root',
      getProps: () => map["index.fjson"],
    };
    let normal = pages.filter((page) => page !== "index.fjson").map((page) => {
      return {
        path: page.slice(0, page.length - 6) + "/",
        component: 'src/containers/Root',
        getProps: () => map[page],
      }
    });
    let error = {
      is404: true,
      component: 'src/containers/404',
    };
    return [root, ...normal, error];
    // return [
    //   {
    //     path: '/about',
    //     component: 'src/containers/About',
    //   },
    //   {
    //     path: '/foo/bar/fuz',
    //     component: 'src/containers/Root',
    //     getProps: () => root,
    //   },
    //   {
    //     path: '/blog',
    //     component: 'src/containers/Blog',
    //     getProps: () => ({
    //       posts,
    //     }),
    //     children: posts.map(post => ({
    //       path: `/post/${post.id}`,
    //       component: 'src/containers/Post',
    //       getProps: () => ({
    //         post,
    //       }),
    //     })),
    //   },
    // ]
  },
  webpack: (config, { defaultLoaders }) => {
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push('.ts', '.tsx')

    // Add TypeScript Path Mappings (from tsconfig via webpack.config.js)
    // to react-statics alias resolution
    config.resolve.alias = typescriptWebpackPaths.resolve.alias

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    config.module.rules = [
      {
        oneOf: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          defaultLoaders.cssLoader,
          defaultLoaders.fileLoader,
        ],
      },
    ]
    return config
  },
}
