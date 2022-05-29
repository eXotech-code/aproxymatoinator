<script lang="ts">
    import type { Step, StepVals, FormT, EvalSet, Needs, ChartNeeds } from "./types";
    import evaluatex from "../node_modules/evaluatex/dist/evaluatex.js";
    import Header from "./Header.svelte";
    import Form from "./Form.svelte";
    import List from "./List.svelte";
    import Preview from "./Preview.svelte";
    import Chart from "./Chart.svelte";
    import { steps, lang } from "./stores";
    import Locale from "./locale";
    import { evaluatexErrorCodes, combinations } from "./common";
    import Info from "./Info.svelte";

    const prepareEvalFunc = (equations: [string, string]) => {
        try {
            equations.forEach((e, i) => {
                if (e) {
                    fi[i] = evaluatex(e, { latex: true } )
                } else {
                    fi[i] = undefined;
                }
            });
        } catch (err) {
            if (evaluatexErrorCodes.get(err)) {
                console.log(evaluatexErrorCodes.get(err));
            } else {
                console.log(err);
            }
            fi = [undefined, undefined];
        }

        return fi;
    }

    const makeStep = (i: number, j: number, initials: [number, number], h: number, steps: Step[], method: string) => {
        let initial = initials[i % 2];
        let x = parseFloat((h * j).toFixed(3));
        let y;
        let f;
        let prevStep = steps[j-1];
        if (j === 0) {
            y = initial;
        } else if (method === "Euler") {
            y = parseFloat((prevStep.y + h*prevStep.f[0]).toFixed(3));
        } else {
            let addedFs = 0;
            prevStep.f.forEach((k, j) => { 
                addedFs += j === 1 || j === 2 ? 2*k : k;
            });
            y = parseFloat((prevStep.y + (1/6) * h * addedFs).toFixed(3));
        }

        // Calculate f_i
        try {
            f = [fi[i % 2]({x: x, y: y, e: Math.E})];
            if (method === "Runge-Kutta") {
                for (let j = 0; j < 2; j++) {
                    f.push(fi[i % 2]({x: x + h/2, y: y + f[j]/2, e: Math.E}));
                }
                f.push(fi[i % 2]({x: x + h, y: y + f[2], e: Math.E}));
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }

        return { x: x, y: y, f: f };
    }

    // Generates a list of steps based on a certain requirement.
    const generateSteps = (stepN: number, h: number, initials: [number, number], fi: EvalSet, method: string, i: number) => {
        console.log("Called!");
        if (!fi[0]) return undefined;
        let tainted = [false, false];

        let steps: Step[] = [];
        let newStep: Step;

        // Calculate y_i for both functions
        for (let j = 0; j <= stepN; j++) {
            if (!tainted[j]) {
                newStep = makeStep(i, j, initials, h, steps, method);
                /* If computed y value exceeds biggest possible integers size
                 * we will just stop the computation here and set the variable
                 * that will show that fact on the list of values */
                if (newStep.y >= Number.MAX_SAFE_INTEGER) {
                    tainted[i] = true;
                }
                
                // Create a new step with those values.
                steps = [...steps, newStep];
            }
        }

        return steps;
    }

    /* Generate or retrieve the steps that
     * are needed by certain UI elements */
    const getNeeded = (needs: [string, string], steps: StepVals, stepN: number, h: number, initials: [number, number], fi: EvalSet, changed: boolean) => {
        let combNumber = combinations.get(needs.join(""));

        /* If the combination has already been calculated
         * just retrieve it. */
        let needed = steps[combNumber];
        if (needed.length && !changed) {
            return needed;
        }

        /* Generate new steps for the required needs. */
        let newSteps = generateSteps(stepN, h, initials, fi, needs[1], combNumber);
        if (!newSteps) {
            return [];
        }

        return newSteps;
    }

    const isInvalid = (f: FormT) => {
        let invalid = false;
        let vals = Object.values(f);
        vals.forEach((v, i) => {
            if ((i === 0 || i === vals.length-1) && (v[0] === NaN || v[0] === "")) {
                invalid = true;
            } else if (form.equations[1] && form.initials[1] === NaN) {
                invalid = true;
            } else {
                if (v === NaN) {
                    invalid = true;
                }
            }
        });
        return invalid;
    }

    // Helper function for array comparison
    const arrEqual = (arr1, arr2) => {
        let equal = true;
        arr1.forEach((a, i) => equal = a === arr2[i]);

        return equal;
    }

    // Object equality comparator (for checking if form changes).
    const objEqual = (obj1: Object, obj2: Object) => {
        if (!(obj1 && obj2)) return false;
        let equal = true;
        let obj2Vals = Object.values(obj2);
        Object.values(obj1).forEach((v, i) => {
            /* If both arrays contain false values,
             * then they are cosidered as equal
             * whether those falsy values are
             * actually different in type. */
            if (Array.isArray(v)) {
                equal = arrEqual(v, obj2Vals[i]);
                v.forEach((val, j) => {
                    if (!val && !obj2Vals[i][j]) equal = true;
                });
            } else {
                equal = v === obj2Vals[i];
            }
        });

        return equal;
    }

    let langId = 0;
    let changeLang = () => {
        langId ? langId = 0 : langId = 1;
        lang.update(() => new Locale(langId));
    }
    changeLang = changeLang.bind(this);

    let form: FormT = {
        initials: [10, NaN],
        steps: 100,
        stepSize: 0.01,
        equations: ["3x+y", ""]
    }

    /* This is used by getNeeded to compare if something changed
     * in order to find out if steps need to be recomputed */
    let oldForm: FormT;
    let changed = true;

    const emptyNeed: [string, string] = ["Nothing", "Nothing"];
    // 0: Chart (compare 1), 1: Chart (compare 2), 2: List
    let needs: Needs[] = [["x(t)", "Euler"], emptyNeed, ["x(t)", "Euler"]];
    let chartNeeds: ChartNeeds = needs.slice(0, 2) as ChartNeeds;
    $: { chartNeeds.forEach((need, i) => needs[i] = need) };
    // Prepare the functions beforehand only once for all steps.
    $: fi = prepareEvalFunc(form.equations);
    $: {
        if (!isInvalid(form)) {
            changed = !objEqual(oldForm, form);
            needs.forEach(n => {
                if (!arrEqual(n, emptyNeed)) {
                    steps.update(s => {
                        let newSteps = getNeeded(n, $steps, form.steps, form.stepSize, form.initials, fi, changed);
                        s[combinations.get(n.join(""))] = newSteps;
                        return s;
                    });
                }
            });
            oldForm = JSON.parse(JSON.stringify(form));
        }
    }

    /* This shows whether input is a system of differential
     * equations or rather only one equation. */
    $: system = $steps[1].length > 0;
    // Set of two arrays as chart data;
    let chartSet: StepVals = [[],[]];
    $: {
        let comboNumber = 0;
        needs.slice(0, 2).forEach((n, i) => {
            if (!arrEqual(n, emptyNeed)) {
                comboNumber = combinations.get(n.join(""));
                chartSet[i] = $steps[comboNumber];
            }
        });
    }
</script>

<main>
    <Header {changeLang} />
    <div>
        <Form bind:value={form} />
        <Preview equations={form.equations} />
        <Chart {system} stepSet={chartSet} bind:needs={chartNeeds} />
        <List
            equations={form.equations}
            numberOfSteps={form.steps}
            {system}
            bind:needs={needs[2]}
            steps={$steps[combinations.get(needs[2].join(""))]}
        />
    </div>
    <Info equations={form.equations} {system} />
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

    :root {
        --background-color: #F0D1D1;
        --ui-color: #FFF0EB;
        --invalid-color: #f93e35;
        --border-color: #3A445D;
        --border-radius: 12px;
        --shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
        --elevation-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    }

    :global(body) {
        background: var(--background-color);
        padding: 1rem;
    }

    @media screen and (min-width: 1000px) {
        main > div {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: max-content max-content 1fr;
            grid-template-areas: 
                "form preview"
                "list chart"
                "list .";
        }
    }

    @media screen and (max-width: 1000px) {
        main > div {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: max-content max-content 1fr;
            grid-template-areas: 
                "form preview"
                "chart chart"
                "list list";
        }
    }

    @media screen and (max-width: 600px) {
        main > div {
            grid-template-columns: 1fr;
            grid-template-rows: max-content max-content max-content 1fr;
            grid-template-areas: 
                "form"
                "preview"
                "chart"
                "list";
        }
    }

    main {
        font-family: 'Roboto', sans-serif;
	}

    main > div {
        display: grid;
        gap: 1rem;
    }
</style>