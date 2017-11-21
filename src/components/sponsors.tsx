import * as React from 'react';

declare var $: any;

export interface SponsorData {
    name: string;
    profile: string;
    link: string;
    logo: string;
}

export interface Sponsors {
    goldSponsors: string[];
    silverSponsors: string[];
    bronzeSponsors: string[];
    sponsorData: { [sponsor: string]: SponsorData };
}

export interface SponsorViewProps {
    sponsors: Sponsors;
}

export interface SponsorRowProps {
    category: string;
    ids: string[];
    width: number;
    sponsors: SponsorData[];
    logoUrl: (sponsor: string, logo: string) => string;
}

export interface SponsorItemProps {
    sponsor: SponsorData;
    width: number;
    src: string;
}

export class SponsorItem extends React.Component<SponsorItemProps, {}> {
    componentDidMount() {
        $('.button').popup({ inline: true });
        $('.sponsorlink').popup({ inline: true });
    }
    render() {
        return (
            <div key={this.props.sponsor.name} className="blue item level"
                style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", marginLeft: "5px", marginRight: "5px" }}>
                <a className="sponsorlink" href={this.props.sponsor.link}>
                    <img className="thumbnail thumbshadow" width={this.props.width}
                        src={this.props.src} />
                </a>
                <div className="ui special popup">
                    <div style={{ width: "400px", padding: "5px" }}>
                        <img width={this.props.width * 2} style={{ margin: "10px", float: "left" }} src={this.props.src} />
                        <h2>{this.props.sponsor.name}</h2>
                        <p>{this.props.sponsor.profile}</p>
                    </div>
                </div>
            </div>
        );
    }
}
export class SponsorRow extends React.Component<SponsorRowProps, {}> {
    render() {
        return (
            <div className="ui text menu" style={{ margin: "0px", paddingTop: "5px", paddingBottom: "5px", display: "flex", flexWrap: "wrap" }}>
                <span className="blue item level" style={{ width: "4em" }} >
                    {this.props.category}
                </span>
                {this.props.sponsors.map((sponsor, i) => <SponsorItem key={sponsor.name} sponsor={sponsor} width={this.props.width} src={this.props.logoUrl(this.props.ids[i], sponsor.logo)} />)}
            </div>);
    }
}

export class SponsorView extends React.Component<SponsorViewProps, {}> {
    constructor(props: SponsorViewProps, context?: {}) {
        super(props, context);
    }

    render() {
        let logoUrl = (sponsor: string, logo: string) => `/_static/sponsors/${sponsor}/${logo}`;
        let extract = (name: string) => {
            let data = this.props.sponsors.sponsorData[name];
            if (!data) { console.warn("No data for " + name); }
            return data;
        };
        let gold = this.props.sponsors.goldSponsors.map(extract);
        let silver = this.props.sponsors.silverSponsors.map(extract);
        let bronze = this.props.sponsors.bronzeSponsors.map(extract);
        return (
            <div className="ui segment raised" style={{ display: "inline-block" }}>
                <div className="content">
                    <div >
                        <h2>Sponsors</h2>
                        <div style={{ borderLeft: "1px solid #ccccc" }}>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(207, 181, 59, .2)" }} >
                                <a className="ui blue ribbon label">Gold Sponsors</a>
                                <SponsorRow category="Gold" width={120} sponsors={gold} ids={this.props.sponsors.goldSponsors} logoUrl={logoUrl} />
                            </div>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(230, 232, 250, .2)" }}>
                                <a className="ui blue ribbon label">Silver Sponsors</a>
                                <SponsorRow category="Silver" width={80} sponsors={silver} ids={this.props.sponsors.silverSponsors} logoUrl={logoUrl} />
                            </div>
                            <div className="ui raised segment" style={{ backgroundColor: "rgba(140, 120, 83, .2)" }}>
                                <a className="ui blue ribbon label">Bronze Sponsors</a>
                                <SponsorRow category="Bronze" width={40} sponsors={bronze} ids={this.props.sponsors.bronzeSponsors} logoUrl={logoUrl} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}
