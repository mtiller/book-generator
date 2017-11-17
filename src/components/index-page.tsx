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
                <span>{letter}</span>
                <ul>{entries.map((entry: Entry, i) => <li key={i}>{this.renderEntry(entry)}</li>)}</ul>
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
            return (
                <div>
                    <span>{label} - {JSON.stringify(selfs)}</span>
                    <ul>
                        {subs.map((sub, i) => <li key={i}>{this.renderRootEntry(sub)}</li>)}
                    </ul>
                </div>
            );
        }
        return (
            <div>
                <span>{label}</span>
                <div>{JSON.stringify(info)}</div>
            </div>
        )
    }
    render() {
        return (
            <div>
                <div className="ui fluid" style={{ textAlign: "center" }}>
                    <img src="/_static/images/TitleHeading.png" />
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }} className="ui sub header">by Dr. Michael M. Tiller</h3>
                </div>

                <h1>Index</h1>
                <div style={{ display: "flex" }}>
                    {this.letters.map((letter, index) => <a style={{ flexGrow: 1 }} key={index} href="#">{letter}</a>)}
                </div>
                <div>
                    {this.props.index.genindexentries.slice(0, 1).map((entry, i) => (
                        <div key={i}>
                            {this.renderRootEntry(entry)}
                        </div>
                    ))}
                </div>
                <h2>Index Data</h2>
                <pre>
                    {JSON.stringify(this.props.index, null, 4)}
                </pre>
            </div>
        )
    }
}