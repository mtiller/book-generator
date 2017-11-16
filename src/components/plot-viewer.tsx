import * as React from 'react';
import { LineChart, XAxis, CartesianGrid, Tooltip, Line, Legend, YAxis } from 'recharts';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import debug from 'debug';
const plotDebug = debug("mbe:plot");
// plotDebug.enabled = true;

export type Results = { [id: string]: number[] | number };
export type Descriptions = { [id: string]: string };

export interface PlotViewerProps {
    title: string;
    xvar: string;
    results: Results;
    ylabel: string;
    ymin: number | null;
    ymax: number | null;
    descriptions: Descriptions;
    legendAlign?: "left" | "right" | "center";
    legendVerticalAlign?: "top" | "middle" | "bottom";
}

export const colorMap10 = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
export const colorMap20 = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd",
    "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

@observer
export class PlotViewer extends React.Component<PlotViewerProps, {}> {
    @computed private get signals() {
        return Object.keys(this.props.results);
    }
    @computed private get data() {
        let signals = this.signals;
        if (!this.props.results.hasOwnProperty(this.props.xvar)) {
            console.warn("Unable to find independent variable " + this.props.xvar + " in data: " + JSON.stringify(signals));
            return [];
        }
        let ind = this.props.results[this.props.xvar] as number[];
        if (typeof ind === "number") {
            console.warn("Independent variable is a constant!");
            return [];
        }
        let data = ind.map((_, i) => {
            let ret: { [signal: string]: number } = {};
            signals.map((sig) => {
                let v = this.props.results[sig];
                if (typeof v === "number") {
                    ret[sig] = v;
                } else {
                    ret[sig] = v[i];
                }
            });
            return ret;
        });
        plotDebug("data = %o", data);
        return data;
    }
    render() {
        let show = Object.keys(this.props.results).filter((v) => v !== "time");
        return (
            <div>
                <h2 style={{ textAlign: "center" }}>{this.props.title}</h2>
                <div style={{ marginLeft: "auto", marginRight: "auto", border: "1px solid black" }}>
                    <LineChart
                        width={600}
                        height={400}
                        data={this.data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis name="Time (s)" dataKey={this.props.xvar} />
                        {/* 
                            This YAxis doesn't have a label.  The prop is this.props.ylabel, but the @types/recharts aren't updated to allowt his:
                            https://github.com/recharts/recharts/issues/782#issuecomment-331203175
                        */}
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        {show.map((signal, i) => <Line key={signal} type="monotone" dataKey={signal} stroke={colorMap10[i % 10]} yAxisId={0} name={this.props.descriptions[signal] || signal} />)}
                        <Legend verticalAlign={this.props.legendVerticalAlign || "top"} align={this.props.legendAlign || "right"} height={36} />
                    </LineChart>
                </div>
            </div>);
    }
}