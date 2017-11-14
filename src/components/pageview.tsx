import * as React from 'react';
import { SphinxPage } from '../sphinx';
import { renderFigures } from './figures';

declare var $: any;

export interface PageViewProps {
    data: SphinxPage;
}

export class PageView extends React.Component<PageViewProps, {}> {
    private content: HTMLDivElement | null = null;
    /**
     * "What happens in the browser, stays in the browser"
     * 
     * None of this happens during the server side rendering.  Both
     * require a DOM in order to do their thing.
     */
    componentDidMount() {
        // This activates the "thumb" so that the TOC can be exposed by
        // clicking on it.
        $("#toc-sidebar").sidebar("attach events", "#thumb", "toggle");

        // Note that this is only called when mounting.  This means two 
        // things.  First, it means that it will not be rendered server
        // side (only in the DOM).  The other slightly dodgy thing
        // here is that this is rendering (using ReactDOM.render)
        // inside a section of the DOM that is ostensibly already
        // being managed by React.  But it is in "dangerous inner HTML"
        // so I suspect React isn't too concerned with that.
        if (this.content) renderFigures(this.content);
    }
    render() {
        let data = this.props.data;
        return (
            <div>
                <div className="ui top fixed inverted menu">
                    {data.prev && <div className="left menu">
                        <div id="thumb" className="title item">
                            <i className="icon list layout"></i>
                        </div>

                        <div className="title item">
                            <i className="icon left arrow"></i>
                            <a href={data.prev.link}>{data.prev.title}</a>
                        </div>
                    </div>}
                    {data.parents && data.parents.length > 0 ?
                        <div className="title item">
                            <i className="icon up arrow"></i>
                            <a className="title-font" href={data.parents[data.parents.length - 1].link}>
                                {data.parents[data.parents.length - 1].title}
                            </a>
                        </div>
                        : <div className="title item">
                            <i className="icon home"></i>
                            <a className="title-font" href="/">
                                Home
                            </a>
                        </div>
                    }

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
                    <div style={{ display: "flex" }}>
                        <i className="ui icon map pin" />{data.parents && data.parents.map((parent, i) => <div key={i}><a className="section" href={parent.link}>{parent.title}</a><i className="angle right icon divider" /></div>)}
                        {data.title}
                    </div>
                    <div ref={(content) => this.content = content} dangerouslySetInnerHTML={{ __html: data.body }} />
                </div>

                <div id="toc-sidebar" className="ui styled sidebar vertical">
                    <h3><a href="/">Table of Contents</a></h3>
                    {<ul>
                        {data.parents && data.parents.map((parent, i) => <li key={i}><a className="section" href={parent.link}>{parent.title}</a></li>)}
                    </ul>}
                    <div dangerouslySetInnerHTML={{ __html: data.toc }} />
                </div>
            </div>
        )
    }
}
