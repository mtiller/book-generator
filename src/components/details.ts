export interface CaseData {
    mods: {};
    vars: Array<{
        style: string,
        scale: number,
        name: string,
        legend: string,
    }>;
    ncols: number;
    title: string;
    legloc: "upper right" | "upper left" | "lower right" | "lower left";
    res: string;
    ncp: number;
    stopTime: number;
    tol: number;
    ylabel: string;
    ymin: number | null;
    type: string;
    ymax: number | null;
}

export interface Details {
    categories: {
        discrete?: string[];
        continuous?: string[];
        parameter?: string[];
    };
    desc: {
        modelName: string;
        shortName: string;
        description: string;
    };
    vars: {
        [varname: string]: {
            variability: string;
            valueReference: string;
            description: string;
            units?: string;
            start?: string;
            causality: string;
            name: string;
        }
    };
    casedata: CaseData;
}
