export type Step = {
    x: number;
    y: number;
    f?: number[];
};

export type StepVals = [Step[], Step[], Step[]?, Step[]?];

export type FormT = {
    initials: [number, number];
    steps: number;
    stepSize: number;
    equations: [string, string];
};

export type EvalSet = Array<(variables: object) => number>;

export type Needs = [string, string];
export type ChartNeeds = [Needs, Needs];