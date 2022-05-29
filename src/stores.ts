import type { StepVals } from "./types";
import { writable } from "svelte/store";
import Locale from "./locale";

let s: StepVals = [[],[], [], []];
export const steps = writable(s);

export const lang = writable(new Locale(0));