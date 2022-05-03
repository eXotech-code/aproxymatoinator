import type { Step } from "./types";
import katex from "katex";

export const renderToString = (eq: string) => {
    return katex.renderToString(eq, { throwOnError: false, output: "mathml" });
}

export const fillTemplate = (str: string, vals: object) => {
    const newStr = str.replace(/\${(.*?)}/g, (x, g) => vals[g]);
    return newStr;
}

export const genTemplateEquation = (eq:string, steps: Step[], i: number) => {
    const tokens = { x: steps[i].x, y: steps[i].y, e: Math.E };
    const replaced = eq.replace(/(\\[A-Za-z]+{)|([xy])/g, (x, trash, idx) => tokens[idx]);

    return replaced;
}

export const evaluatexErrorCodes = new Map([
    ["Lexer error: reached end of stream", "LxErr"],
    ["Error: Symbol y is undefined or not a number", "SymUndef"],
    ["Error: Symbol x is undefined or not a number", "SymUndef"]
]);