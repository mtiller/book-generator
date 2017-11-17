import * as React from 'react';
import { IndexData } from '../sphinx';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import debug from 'debug';
const indexDebug = debug("mbe:index");
indexDebug.enabled = true;

export interface IndexPageProps {
    index: IndexData;
    titles: { [href: string]: string };
}

type SelfLink = ["", string];
type Entry = [string, [SelfLink[], any[], null]];

@observer
export class IndexPage extends React.Component<IndexPageProps, {}> {
    @computed get letters(): string[] {
        return this.props.index.genindexentries.map((x) => x[0]);
    }
    renderRootEntry(level: [string, any[]]): JSX.Element {
        indexDebug("level = %o", level);
        let letter = level[0];
        let entries = level[1];
        return (
            <div>
                <span id={"index-" + letter}>{letter}</span>
                <ul>{entries.map((entry: Entry, i) => <li key={i}>{this.renderEntry(entry)}</li>)}</ul>
            </div>
        )
    }
    renderTerm(term: string, urls: string[], children: Entry[]): JSX.Element {
        let me = urls.length == 0 ? <span>{term}</span> : <div><a href={urls[0]}>{term}</a>{urls.slice(1).map((x, i) => <a key={i} href={x}>&nbsp;[{[i + 1]}]</a>)}</div>
        let nested = children.length == 0 ? null : <ul>{children.map((sub, i) => <li key={i}>{this.renderEntry(sub)}</li>)}</ul>
        return (
            <div>
                {me}
                {nested}
            </div>
        )
    }
    renderEntry(entry: Entry): JSX.Element {
        let str = JSON.stringify(entry);
        if (!Array.isArray(entry)) return <div>Entry was not an array - {str}</div>;
        let types = JSON.stringify(entry.map((v) => {
            if (v == null) return null;
            if (Array.isArray(v)) return "array";
            return typeof v;
        }));
        if (entry.length != 2) return <div>Entry wasn't a 2-tuple - {types} - {str}</div>;
        let label = entry[0];
        let info = entry[1];
        if (info.length == 3 && Array.isArray(info[0]) && Array.isArray(info[1]) && info[2] == null) {
            let selfs = info[0];
            let subs = info[1];
            return this.renderTerm(label, selfs.map((x) => x[1]), subs);
        }
        if (entry.length == 2 && Array.isArray(entry[1])) {
            return this.renderTerm(label, entry[1].map((x) => x[1]), []);
        }
        return (
            <div>
                <span>Unhandled case: {label} - {JSON.stringify(entry)}</span>
                <div>{JSON.stringify(info)}</div>
            </div>
        )
    }
    render() {
        let sum = this.props.index.genindexcounts.reduce((s: number, a: number) => s + a, 0);
        indexDebug("total # of entries: %d", sum);
        let perc = Math.ceil(sum / 2.8);
        indexDebug("Entries per column: %d", perc);
        let column1: any[] = [];
        let column2: any[] = [];
        let column3: any[] = [];

        let total = 0;
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        this.props.index.genindexentries.forEach((entry, i) => {
            let size = this.props.index.genindexcounts[i];
            if (total < perc) { column1.push(entry); c1 += size; }
            else if (total < 2 * perc) { column2.push(entry); c2 += size }
            else { column3.push(entry); c3 += size }
            total += size;
        })
        indexDebug("Column 1 contains %d entries", c1);
        indexDebug("Column 2 contains %d entries", c2);
        indexDebug("Column 3 contains %d entries", c3);
        return (
            <div>
                <div className="ui fluid" style={{ textAlign: "center" }}>
                    <img src="/_static/images/TitleHeading.png" />
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }} className="ui sub header">by Dr. Michael M. Tiller</h3>
                </div>

                <h1>Index</h1>
                <div style={{ display: "flex" }}>
                    {this.letters.map((letter, index) => <a style={{ flexGrow: 1 }} key={index} href={"#index-" + letter}>{letter}</a>)}
                </div>
                <div className="ui divider"></div>
                <div style={{ display: "flex" }}>
                    <div id="column1">
                        {column1.map((entry, i) => (
                            <div key={i}>
                                {this.renderRootEntry(entry)}
                            </div>
                        ))}
                    </div>
                    <div id="column2">
                        {column2.map((entry, i) => (
                            <div key={i}>
                                {this.renderRootEntry(entry)}
                            </div>
                        ))}
                    </div>
                    <div id="column3">
                        {column3.map((entry, i) => (
                            <div key={i}>
                                {this.renderRootEntry(entry)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}