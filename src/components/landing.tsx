import * as React from 'react';
import { SphinxPage } from '../sphinx';
import { Sponsors, SponsorView } from './sponsors';

export interface LandingPageProps {
    data: SphinxPage;
    sponsors: Sponsors;
}

export class LandingPage extends React.Component<LandingPageProps, {}> {
    render() {
        let data = this.props.data;
        return (
            <div>
                <div style={{ float: "right" }}>
                    <p>
                        <a href="http://book.xogeny.com/cn">中文版</a>
                        <br />
                        <a href="http://modelicabyexample.globalcrown.com.cn/">国内镜像</a>
                    </p>
                </div>
                <div className="ui fluid" style={{ textAlign: "center" }}>
                    <img src="/_static/images/TitleHeading.png" />
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }} className="ui sub header">by Dr. Michael M. Tiller</h3>
                </div>

                <div className="ui divider" />

                <div style={{ display: "flex" }}>
                    <div id="column1" style={{ flexGrow: 1, marginRight: "20px" }}>
                        <div className="ui segment">
                            <h1>Table of Contents</h1>
                            <div dangerouslySetInnerHTML={{ __html: data.body }}>
                            </div>
                        </div>
                    </div>
                    <div id="column2">
                        <SponsorView sponsors={this.props.sponsors} />
                        <div className="ui segment raised">
                            <h2>Purchase the EBook Edition</h2>
                        </div>
                        <div className="ui segment raised">
                            <h2>Links</h2>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}