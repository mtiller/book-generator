import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SphinxPage, GlobalData } from '../sphinx';
import { renderFigures } from './figures';
import { SearchBox } from './search';
import { Peek } from './peek';

import debug from 'debug';
const pageDebug = debug("mbe:page-view");
// pageDebug.enabled = true;

declare var $: any;

export interface PageViewProps {
    data: SphinxPage;
    titles: { [id: string]: string };
    context: GlobalData;
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

        let annotations: HTMLSpanElement[] = $("span.kr:contains(annotation)");
        let markers: Array<Array<Node>> = [];
        pageDebug("Found %d annotations on this page", annotations.length);
        for (let i = 0; i < annotations.length; i++) {
            let annotation = annotations[i];
            let nodes: Node[] = [annotation];
            pageDebug("Searching for end of annotation %d", i);
            for (let sib = annotation.nextSibling; sib != null; sib = sib.nextSibling) {
                nodes.push(sib);
                if (sib.textContent.endsWith(";")) {
                    markers.push(nodes);
                    pageDebug("  Found end of annotation: %o", sib);
                    break;
                }
            }
        }

        // Loop over all markers and add a "Peek" component
        markers.forEach((marker) => {
            // Find the parenthesis that starts this segment of the DOM
            let paren = marker[1];
            // Get its parent
            let parent = paren.parentElement;

            // Assuming it has a parent...
            if (parent) {
                // Create a new span inside the code fragment where we can mount any
                // React components and style it.
                let mountPoint = document.createElement('span');
                mountPoint.setAttribute("style", "");

                // Insert this new mount point right before the paren node
                parent.insertBefore(mountPoint, paren);

                // Now create a dummy container
                let con = document.createElement('div');
                // Fill it with all the nodes in the DOM that we want to toggle
                marker.slice(1).forEach((elem) => con.appendChild(elem));
                // Extract the *inner* HTML for this set of nodes (we don't want the <div> itself, just
                // its contents).
                let html = con.innerHTML;
                // Now foolishly and recklessly mount a Peek component at the mount point
                // and give it a child that has the previous elements inner HTML as it's
                // own inner HTML.  A DOM transplant, if you will.
                ReactDOM.render(<Peek><span dangerouslySetInnerHTML={{ __html: html }} /></Peek>, mountPoint);

                // Now, take shower.
            } else {
                pageDebug("Odd, this element doesn't have a parent?!?: %o", marker[0]);
            }
        })
    }
    render() {
        let data = this.props.data;
        return (
            <div>
                <div className="ui top fixed inverted menu">
                    <div className="left menu">
                        <div id="thumb" className="title item">
                            <i className="icon list layout"></i>
                        </div>

                        {data.prev && <div className="title item">
                            <i className="icon left arrow"></i>
                            <a href={data.prev.link}>{data.prev.title}</a>
                        </div>}
                    </div>

                    <div className="center menu">

                        {data.parents && data.parents.length > 0 &&
                            <div className="title item">
                                <i className="icon up arrow"></i>
                                <a className="title-font" href={data.parents[data.parents.length - 1].link}>
                                    {data.parents[data.parents.length - 1].title}
                                </a>
                            </div>}

                        <div className="title item">
                            <a className="title-font" href="/">
                                <i className="icon home" />
                            </a>
                        </div>

                    </div>

                    <div className="right menu">
                        <SearchBox indexUrl="/lunr.json" titles={this.props.titles} />
                        {data.next && <div className="title item">
                            <a href={data.next.link}>{data.next.title}</a>
                            <i className="icon right arrow"></i>
                        </div>}
                    </div>
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
