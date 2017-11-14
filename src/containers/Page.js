import * as React from 'react';
import { getRouteProps, Link } from 'react-static';

export default getRouteProps((data) => (
    <div>
        <div className="ui top fixed inverted menu">
            {data.prev && <div className="left menu">
                <div id="thumb" className="title item">
                    <i className="icon list"></i>
                </div>

                <div className="title item">
                    <i className="icon left arrow"></i>
                    <a href={data.prev.link}>{data.prev.title}</a>
                </div>
            </div>}
            {data.parents && data.parents.length > 0 && <div id="thumb" className="title item">
                <i className="icon up arrow"></i>
                <a className="title-font" href={data.parents[data.parents.length - 1].link}>
                    {data.parents[data.parents.length - 1].title}
                </a>
            </div>}

            {data.next && <div className="right menu">
                <div className="title item">
                    <a href={data.next.link}>{data.next.title}</a>
                    <i className="icon right arrow"></i>
                </div>
            </div>}
        </div>

        <div>
            <div className="ui fluid" style={{ marginTop: "3em", textAlign: "center" }}>
                <a href="/"><img src="/_static/images/TitleHeading.png" /></a>
            </div>
            <div className="ui divider" style={{ marginTop: "5px" }} />
            <div className="ui breadcrumbs">
                {data.parents && data.parents.map((parent, i) => <div key={i}><a className="section" href={parent.link}>{parent.title}</a><i className="angle right icon divider" /></div>)}
                {data.title}
            </div>
            <div dangerouslySetInnerHTML={{ __html: data.body }} />
            <pre>
                {JSON.stringify(data, null, 4)}
            </pre>
        </div>

        <div id="toc-sidebar" className="ui styled sidebar vertical">
            <h3><a href="/">Table of Contents</a></h3>
            {<ul>
                {data.parents && data.parents.map((parent, i) => <li key={i}><a className="section" href={parent.link}>{parent.title}</a></li>)}
            </ul>}
            <div dangerouslySetInnerHTML={{ __html: data.toc }} />
        </div>
    </div>
));
