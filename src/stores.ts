import type { Step } from "./types";
import { writable } from "svelte/store";
import Locale from "./locale";

let s: Step[] = [];
export const steps = writable(s);

export const lang = writable(new Locale(0));