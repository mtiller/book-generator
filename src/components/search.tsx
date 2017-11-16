import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Index } from 'lunr';

import debug from 'debug';
const searchDebug = debug("mbe:search");
// searchDebug.enabled = true;

export interface SearchBoxProps {
    indexUrl: string;
    titles: { [id: string]: string };
}

export interface SearchHit {
    title: string;
    href: string;
}

@observer
export class SearchBox extends React.Component<SearchBoxProps, {}> {
    @observable index: lunr.Index | null = null;
    @observable term: string | undefined = "";
    @computed get hits(): SearchHit[] {
        searchDebug("Search term: %s", this.term);
        searchDebug("Index defined? %j", !!this.index);
        if (this.index && this.term) {
            let results = this.index.search(this.term);
            results = results.slice(0, 10);
            searchDebug("results = %o", results);

            // $('.ui.search')
            //     .search({
            //         source: content,
            //         searchFields: [
            //             'title'
            //         ],
            //         searchFullText: false
            //     });
            return results.map((result) => ({ title: this.props.titles[result.ref], href: result.ref }));
        }
        return [];
    }
    async componentDidMount() {
        try {
            let resp = await fetch(this.props.indexUrl);
            let data = await resp.json();
            this.index = Index.load(data);
        } catch (e) {
            console.error("Error fetching LUNR index at " + this.props.indexUrl);
            console.error(e);
        }
    }
    render() {
        return (
            <div className="ui category search item">
                <div className="ui inverted transparent icon input">
                    <input
                        className="prompt"
                        type="text"
                        value={this.term}
                        onChange={(ev) => this.term = ev.target.value}
                        placeholder="Search terms..." />
                    <i className="search link icon" />
                </div>
                {this.hits.length > 0 && <div
                    className={"results transition visible"}
                    style={{ display: 'block !important' }}>
                    {this.hits.map((hit, i) => (
                        <a key={i} className="result" href={hit.href}>
                            <div className="content2">
                                <div className="title">{hit.title}</div>
                                {/*<div className="description">
                                    {hit.title}
                                </div>*/}
                            </div>
                        </a>
                    ))}
                </div>}
            </div>
        );
    }
}