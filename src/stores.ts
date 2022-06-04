import { writable } from "svelte/store";
import Locale from "./locale";

export const lang = writable(new Locale(0));