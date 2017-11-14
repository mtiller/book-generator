import React from 'react';

export function Document(args) {
    const { Html, Head, Body, children, siteProps, renderMeta } = args;
    return (
        <Html >
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta name="generator" content="React Static" />

                <meta property="og:title" content="Modelica by Example" />
                <meta property="og:type" content="books.book" />
                <meta property="og:url" content="http://beta.book.xogeny.com/" />
                <meta property="og:image" content="http://beta.book.xogeny.com/_static/images/TitleHeading.png" />

                <meta property="og:description"
                    content="A free HTML version of the book 'Modelica by Example', by Michael Tiller" />
                <meta property="og:site_name" content="Modelica by Example" />

                <meta property="article:author" content="http://www.xogeny.com/about/" />
                <meta property="article:tag" content="Modelica" />
                <meta property="article:tag" content="modeling" />
                <meta property="article:tag" content="simulation" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="http://beta.book.xogeny.com/" />
                <meta name="twitter:title" content="Modelica by Example" />
                <meta name="twitter:description"
                    content="A free HTML version of the book 'Modelica by Example', by Michael Tiller" />
                <meta name="twitter:image" content="http://beta.book.xogeny.com/_static/images/TitleHeading.png" />

                <link rel="icon" href="/_static/images/favicon.ico" />
                <link href="http://fonts.googleapis.com/css?family=Domine:400,700" rel="stylesheet" type="text/css" />
                <link href="http://fonts.googleapis.com/css?family=Inconsolata:400,700" rel="stylesheet" type="text/css" />
                <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
                <link rel="stylesheet" type="text/css" className="ui" href="/_static/semantic/semantic.css" />
                <link rel="stylesheet" href="/_static/xogeny.css" type="text/css" />
                <link rel="stylesheet" href="/_static/pygments.css" type="text/css" />
                <link rel="stylesheet" href="/_static/tweaks.css" type="text/css" />
                <script async={true} src="//www.google-analytics.com/analytics.js"></script>
                <script type="text/javascript" src="/_static/jquery.js"></script>
                <script type="text/javascript" src="/_static/semantic/semantic.js"></script>

                <script dangerouslySetInnerHTML={{
                    __html: `(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-33034217-6', 'xogeny.com');
  ga('send', 'pageview');`}} />

                <link href="//cdn-images.mailchimp.com/embedcode/slim-081711.css"
                    rel="stylesheet" type="text/css" />
                {/* <style type="text/css">
  #mc_embed_signup{background:#transparent; clear:left; font:14px Helvetica,Arial,sans-serif; }
    </style> */}
            </Head>
            <Body>
                {children}
                <script type="text/javascript" src="../../../_static/xogeny.js"></script>
            </Body>
        </Html>)
}