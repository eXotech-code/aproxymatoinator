export type Step = {
    t: number;
    x: number;
    y: number;
    fx?: number[];
    fy?: number[];
};

export type ComponentStep = {
    t: number;
    y: number;
    ft: number[];
}
export type ComponentSteps = ComponentStep[];
export type ChartSteps = ComponentSteps[];

export type FormT = {
    init: [number, number];
    n: number;
    h: number;
    eqs: [string, string];
};

export type EvalSet = Array<(variables: object) => number>;

export type Dataset = [number[], number[]];
