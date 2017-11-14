import React from 'react';

export function Document(args) {
    const { Html, Head, Body, children, siteProps, renderMeta } = args;
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
}