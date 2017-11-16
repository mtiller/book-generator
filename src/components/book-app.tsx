import * as React from 'react';
import { observer } from 'mobx-react';
import { Siren, Action } from 'siren-types';
import { Details } from './details';
import { computed, observable } from 'mobx';
import { PlotViewer, Descriptions } from './plot-viewer';

import debug from 'debug';
const appDebug = debug("mbe:book-app");
// appDebug.enabled = true;

export type Success = { type: "success", results: Results };
export type Failure = { type: "failure", log: string };
export type Outcome = Success | Failure;

export interface BookAppProps {
    src: string;
    id: string;
    desc: string;
    action: Action;
    details: Details;
}

function defaultParameters(details: Details): { [id: string]: string } {
    let ret: { [id: string]: string } = {};
    let parameters = details.categories.parameter || [];
    parameters.forEach((param) => {
        let v = details.vars[param];
        ret[param] = v.start || "0.0";
        if (details.casedata.mods.hasOwnProperty(param)) {
            ret[param] = details.casedata.mods[param].toString();
        }
    });
    return ret;
}

type Results = { [id: string]: number[] | number };

@observer
export class BookApp extends React.Component<BookAppProps, {}> {
    @observable private running = false;
    @observable private open = false;
    @observable private parameters: { [id: string]: string };
    @observable private outcome: Outcome | null = null;
    @computed private get results(): Results | null {
        if (this.outcome && this.outcome.type === "success") return this.outcome.results;
        return null;
    }
    @computed private get error(): string | null {
        if (this.outcome && this.outcome.type === "failure") return this.outcome.log;
        return null;
    }
    @computed private get descriptions(): Descriptions {
        if (!this.results) return {};
        if (!this.props.details.casedata) return {};
        let ret: Descriptions = {};
        for (let v of this.props.details.casedata.vars) {
            ret[v.name] = v.legend;
        }
        appDebug("Descriptions: %o", ret);
        return ret;
    }
    @computed private get verticalAlign(): "top" | "middle" | "bottom" {
        if (!this.props.details.casedata) return "top";
        let loc = this.props.details.casedata.legloc;
        if (loc.startsWith("upper") || loc.startsWith("top")) return "top";
        if (loc.startsWith("lower") || loc.startsWith("bottom")) return "bottom";
        return "top";
    }
    @computed private get horizontalAlign(): "left" | "center" | "right" {
        if (!this.props.details.casedata) return "right";
        let loc = this.props.details.casedata.legloc;
        if (loc.endsWith("left")) return "left";
        if (loc.endsWith("right")) return "right";
        return "right";
    }
    private async simulate() {
        this.running = true;
        let payload: { [id: string]: number } = {};
        appDebug("Simulating %s", this.props.id);
        appDebug("Should POST to %s", this.props.action.href);
        Object.keys(this.parameters).forEach((param) => {
            payload[param] = +this.parameters[param];
        });
        if (!this.props.action.href) {
            console.warn("No URL to submit simulation POST request to");
            return;
        }
        appDebug("Payload = %o", payload);
        try {
            let resp = await fetch(this.props.action.href, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(payload),
            });
            let obj = await resp.json() as Siren;
            let classes = obj.class || ["unknown"];
            let props: { stdout?: string, trajectories?: Results } = obj.properties || {};
            appDebug("Siren response: %o", obj);
            if (classes[0] === "error") {
                this.outcome = {
                    type: "failure",
                    log: props.stdout,
                } as Failure;
            } else if (classes[0] === "result") {
                this.outcome = {
                    type: "success",
                    results: props.trajectories,
                } as Success;
            } else {
                this.outcome = {
                    type: "failure",
                    log: "Unrecognized response from server: " + JSON.stringify(obj),
                };
            }
        } catch (e) {
            this.outcome = {
                type: "failure",
                log: e.message,
            } as Failure;
        } finally {
            this.running = false;
        }
    }
    constructor(props: BookAppProps, context?: {}) {
        super(props, context);
        this.parameters = observable(defaultParameters(this.props.details));
    }
    render() {
        let parameters = this.props.details.categories.parameter || [];
        let nchar = parameters.reduce((a, p) => Math.max(a, p.length), 0);

        let results: Results | null = null;
        if (this.results && this.props.details.casedata) {
            results = { ...this.results };
            let keys = Object.keys(results);
            appDebug("Keys in results: %o", keys);
            appDebug("Vars in casedata: %o", this.props.details.casedata.vars);
            for (let key of keys) {
                if (key === "time") {
                    continue;
                }
                let casedata = this.props.details.casedata.vars.find((v) => v.name === key);
                if (casedata) {
                    appDebug("  Found %s in casedata, keeping", key);
                    appDebug("    Multiplying %s by scale factor of %d", key, casedata.scale);
                    let v = results[key];
                    if (typeof v == "number") {
                        results[key] = v * casedata.scale;
                    } else {
                        results[key] = v.map((x) => x * casedata.scale);
                    }
                } else {
                    appDebug("  Did not find %s in casedata, removing", key);
                    delete results[key];
                }
            }
        }
        return (
            <div className="figure" style={{ display: "inline-block" }} >
                <div className="ui segment tight left-justified">
                    <div className="ui accordion" style={{ width: "100%", marginBottom: "2px", display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
                        <div style={{ width: "100%" }} className={"title" + (this.open ? " active" : "")} onClick={() => this.open = !this.open}>
                            <i className="dropdown icon"></i>
                            Run <code>{this.props.id}</code> model interactively
                        </div>
                        <div className={"content left-justified" + (this.open ? " active" : "")}>
                            <div className="ui attached message">
                                <div className="header">
                                    {this.props.id}
                                </div>
                                <p>Full name: {this.props.details.desc.modelName}</p>
                            </div>

                            <div className="ui form small attached fluid segment" id={"form-" + this.props.id}>
                                {parameters.map((param) => {
                                    let v = this.props.details.vars[param];
                                    return (
                                        <div key={param} className="inline field paramrow">
                                            <label className="paramname"
                                                style={{ width: `${nchar + 2}em`, textAlign: "right" }}>
                                                {v.name}
                                            </label>
                                            <input className="paramvalue" placeholder="Initial value"
                                                value={this.parameters[param]} style={{ paddingTop: "4px", paddingBottom: "4px" }}
                                                type="text" onChange={(ev) => this.parameters[param] = ev.currentTarget.value} />
                                            <label>&nbsp;{v.description} [{v.units}]</label>
                                        </div>
                                    );
                                })}

                                <div className={"ui mini button" + (this.running ? " disabled" : "")} id={"sim-button-" + this.props.id} onClick={() => this.simulate()}>
                                    Simulate
                                </div>
                            </div>
                        </div>

                        {results == null && this.error == null && <div id={"plot-wrapper-" + this.props.id} style={{ width: "640px", margin: "4px" }}>
                            <img className="interactive" src={this.props.src} />
                        </div>}
                        {this.error && <div style={{ width: "640px", margin: "4px", paddingBottom: "20px", overflow: "scroll" }}>
                            <h4>Error simulating {this.props.id}</h4>
                            <pre style={{ color: "red" }}>{this.error}</pre>
                        </div>}
                        {results && <div id={"dyn-plot-RLC1" + this.props.id}
                            style={{ width: "640px", margin: "4px", paddingBottom: "20px" }}>
                            <PlotViewer xvar="time" results={results} descriptions={this.descriptions}
                                legendVerticalAlign={this.verticalAlign} ylabel={this.props.details.casedata.ylabel}
                                ymin={this.props.details.casedata.ymin} ymax={this.props.details.casedata.ymax}
                                title={this.props.details.casedata ? this.props.details.casedata.title : this.props.details.desc.description} />
                        </div>}
                    </div>
                </div>
            </div >);
    }
}