export type Step = {
    x: number;
    y: number;
    f?: number;
};

export type FormT = {
    initial: number;
    steps: number;
    stepSize: number;
    equation: string;
};