import * as React from 'react';
import { IndexData } from '../sphinx';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import debug from 'debug';
const indexDebug = debug("mbe:index");
// indexDebug.enabled = true;

export interface IndexPageProps {
    ncol: number;
    index: IndexData;
    titles: { [href: string]: string };
}

type SelfLink = ["", string];
type Entry = [string, [SelfLink[], any[], null]];
type RootEntry = [string, Entry[]];

declare var $: any;

@observer
export class IndexPage extends React.Component<IndexPageProps, {}> {
    componentDidMount() {
        $('.ui.dropdown').dropdown();
    }
    @computed get letters(): string[] {
        return this.props.index.genindexentries.map((x) => x[0]);
    }
    renderRootEntry(level: [string, any[]]): JSX.Element {
        let letter = level[0];
        let entries = level[1];
        return (
            <div>
                <span id={"index-" + letter}>{letter}</span>
                <ul>{entries.map((entry: Entry, i) => <li key={i}>{this.renderEntry(entry)}</li>)}</ul>
            </div>
        )
    }
    renderTerm(term: string, urls: string[], children: Entry[], expand: boolean): JSX.Element {
        let me = urls.length == 0 ? <span>{term}</span> : <span><a href={urls[0]}>{term}</a>{urls.slice(1).map((x, i) => <a key={i} href={x}>&nbsp;[{[i + 1]}]</a>)}</span>
        if (expand) {
            let dropdown = children.length == 0 ? null : (
                <div className="ui dropdown">
                    <div className="text"></div>
                    <i className="dropdown icon" />
                    <div className="menu">
                        {children.map((sub, i) => <div key={i} className="item">{this.renderEntry(sub)}</div>)}
                    </div>
                </div>
            )
            return (
                <div>
                    {me} {dropdown}
                </div>
            )
        }
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
        // First level
        if (info.length == 3 && Array.isArray(info[0]) && Array.isArray(info[1]) && info[2] == null) {
            let selfs = info[0];
            let subs = info[1];
            return this.renderTerm(label, selfs.map((x) => x[1]), subs, true);
        }
        // Second level
        if (entry.length == 2 && Array.isArray(entry[1])) {
            return this.renderTerm(label, entry[1].map((x) => x[1]), [], false);
        }
        return (
            <div>
                <span>Unhandled case: {label} - {JSON.stringify(entry)}</span>
                <div>{JSON.stringify(info)}</div>
            </div>
        )
    }
    render() {
        let size = (e: RootEntry) => e[1].length + 2; // +2 for letter entry + space
        let ncol = this.props.ncol;
        let sum = 0;
        this.props.index.genindexentries.forEach((entry) => {
            indexDebug("  # of entries for %s = %d", entry[0], size);
            sum += size(entry);
        });

        indexDebug("total # of entries: %d", sum);
        let perc = Math.ceil(sum / (ncol * 1));
        indexDebug("Number of columns: %d", ncol);
        indexDebug("Entries per column: %d", perc);
        let columns: any[][] = [];
        for (let i = 0; i < ncol; i++) {
            columns.push([]);
        }
        indexDebug("Columns = %o", columns);

        let total = 0;
        let cur = 0;
        this.props.index.genindexentries.forEach((entry) => {
            if (total + size(entry) > (cur + 1) * perc) {
                cur = Math.min(cur + 1, ncol - 1);
                indexDebug("Current column now %d", cur);
            }
            columns[cur].push(entry);
            total += size(entry);
        })
        return (
            <div>
                <div className="ui fluid" style={{ marginTop: "3em", textAlign: "center" }}>
                    <a href="/"><img src="/_static/images/TitleHeading.png" /></a>
                </div>

                <h1>Index</h1>
                <div style={{ display: "flex" }}>
                    {this.letters.map((letter, index) => <a style={{ flexGrow: 1 }} key={index} href={"#index-" + letter}>{letter}</a>)}
                </div>
                <div className="ui divider"></div>
                <div style={{ display: "flex" }}>
                    {columns.map((column, i) => (
                        <div key={i} style={{ margin: "10px", flexGrow: 1 }}>
                            {column.map((entry, j) => (
                                <div key={j}>
                                    {this.renderRootEntry(entry)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}