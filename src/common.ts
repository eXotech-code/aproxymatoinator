import type { Step } from "./types";
import katex from "katex";

export const renderToString = (eq: string) => {
    return katex.renderToString(eq, { throwOnError: false, output: "mathml" });
}

export const fillTemplate = (str: string, vals: object) => {
    const newStr = str.replace(/\${(.*?)}/g, (x, g) => vals[g]);
    return newStr;
}

export const genTemplateEquation = (eq: string, steps: Step[], i: number, override = { x: null, y: null }) => {
    let x = override.x ? override.x : steps[i].x;
    let y = override.y ? override.y : steps[i].y;
    const tokens = { x: x, y: y, e: Math.E };
    const replaced = eq.replace(/(\\[A-Za-z]+{)|([1-9xy])/g, (x, trash, idx) => {
        let parsed = parseFloat(idx);
        if (isNaN(parsed)) {
            return tokens[idx];
        } else {
            return `${parsed} \\cdot`;
        }
    });

    return replaced;
}

export const evaluatexErrorCodes = new Map([
    ["Lexer error: reached end of stream", "LxErr"],
    ["Error: Symbol y is undefined or not a number", "SymUndef"],
    ["Error: Symbol x is undefined or not a number", "SymUndef"]
]);

export const options = [
    "x(t) Euler",
    "y(t) Euler",
    "x(t) Runge-Kutta",
    "y(t) Runge-Kutta"
];
