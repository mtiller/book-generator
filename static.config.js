// Paths Aliases defined through tsconfig.json

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const find = require('find');
const typescriptWebpackPaths = require('./webpack.config.js')
const React = require('react');
const mjpage = require('mathjax-node-page/lib/main.js').mjpage;

const debug = require('debug');
const genDebug = debug("mbe:gen");
genDebug.enabled = true;

export default {
  getSiteProps: () => ({
    title: 'Modelica by Example',
  }),
  //siteRoot: "http://book.xogeny.com",
  siteRoot: "/",
  getRoutes: async (data) => {
    let dev = data.dev;
    let jsonDir = path.join(__dirname, "..", "text", "build", "json");
    genDebug("jsonDir = %s", jsonDir);
    let results = await new Promise((resolve, reject) => {
      find.file(/\.fjson$/, jsonDir, (files) => {
        resolve(files);
      });
    });
    let pages = results.filter((f) => f.length > jsonDir.length).map((f) => f.slice(jsonDir.length));
    genDebug("# of pages = %j", pages.length);

    let map = {};
    for (let i = 0; i < pages.length; i++) {
      let page = pages[i];
      let file = path.join(".", "json", page);
      let obj = JSON.parse(fs.readFileSync(file).toString());
      // if (obj.body && !dev) {
      //   obj.body = await new Promise((resolve, reject) => {
      //     genDebug("Rendering math for %s", page);
      //     mjpage(obj.body, { format: ["TeX"] }, { svg: true }, (output) => resolve(output));
      //     genDebug("...done");
      //   });
      // }
      map[page] = obj;
    }

    let root = {
      path: '/',
      component: 'src/containers/Root',
      getProps: () => map["/index.fjson"],
    };
    let normal = pages.filter((page) => page !== "index.fjson").map((page) => {
      return {
        path: page.slice(0, page.length - 6) + "/",
        component: 'src/containers/Page',
        getProps: () => map[page],
      }
    });
    genDebug("# of normal pages: %j", normal.length);
    let error = {
      is404: true,
      component: 'src/containers/404',
    };
    return [root, ...normal, error];
  },

  renderToHtml: (render, Component, meta) => {
    return render(<Component />);
  },

  Document: ({ Html, Head, Body, children, siteProps, renderMeta }) => {
    return (
      <Html >
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="icon" href="/_static/images/favicon.ico" />
          <link href="http://fonts.googleapis.com/css?family=Domine:400,700" rel="stylesheet" type="text/css" />
          <link href="http://fonts.googleapis.com/css?family=Inconsolata:400,700" rel="stylesheet" type="text/css" />
          <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
          <link rel="stylesheet" type="text/css" className="ui" href="/_static/semantic/semantic.css" />
          <link rel="stylesheet" href="/_static/xogeny.css" type="text/css" />
          <link rel="stylesheet" href="/_static/pygments.css" type="text/css" />
          <link rel="stylesheet" href="/_static/tweaks.css" type="text/css" />
          <script async="" src="//www.google-analytics.com/analytics.js"></script>
          <script type="text/javascript" src="/_static/jquery.js"></script>
          <script type="text/javascript" src="/_static/semantic/semantic.js"></script>

          <script>
            {`(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-33034217-6', 'xogeny.com');
  ga('send', 'pageview');`}
          </script>
        </Head>
        <Body>
          {children}
          <script type="text/javascript" src="../../../_static/xogeny.js"></script>
        </Body>
      </Html>)
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
