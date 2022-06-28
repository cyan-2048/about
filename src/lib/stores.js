import { writable } from "svelte/store";

export const count = writable(0);
// @ts-ignore
export const production = import.meta.env.PROD;
