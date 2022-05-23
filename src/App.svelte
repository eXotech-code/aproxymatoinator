<script lang="ts">
    import type { Step, StepVals, FormT, EvalSet } from "./types";
    import evaluatex from "../node_modules/evaluatex/dist/evaluatex.js";
    import Header from "./Header.svelte";
    import Form from "./Form.svelte";
    import List from "./List.svelte";
    import Preview from "./Preview.svelte";
    import Chart from "./Chart.svelte";
    import { steps, lang } from "./stores";
    import Locale from "./locale";
    import { evaluatexErrorCodes } from "./common";
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

    const generateSteps = (stepN: number, h: number, initials: [number, number], fi: EvalSet) => {
        console.log(initials);
        if (!fi[0]) return undefined;
        let steps: StepVals = [[], []];
        let tainted = [false, false];

        let y: number;
        let f: number;
        let x: number;
        let newStep: Step;
        const count = fi[1] ? 2 : 1;

            for (let i = 0; i < count; i++) {
                // Calculate y_i for both functions
                for (let j = 0; j <= stepN; j++) {
                    if (!tainted[j]) {
                        x = parseFloat((h * j).toFixed(3));
                        y = parseFloat((j === 0 ? initials[i] : steps[i][j-1].y + h*steps[i][j-1].f).toFixed(3));

                        /* If computed y value exceeds biggest possible integers size
                         * we will just stop the computation here and set the variable
                         * that will show that fact on the list of values */
                        if (y >= Number.MAX_SAFE_INTEGER) {
                            tainted[i] = true;
                        }

                        // Calculate f_i
                        try {
                            f = fi[i]({x: x, y: y, e: Math.E});
                        } catch (err) {
                            console.log(err);
                            return undefined;
                        }

                        newStep = { x: x, y: y, f: f };
                        // Create a new step with those values.
                        steps[i] = [...steps[i], newStep];
                    }
                }
            }

        return steps;
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

    let langId = 0;
    let changeLang = () => {
        langId ? langId = 0 : langId = 1;
        lang.update(() => new Locale(langId));
    }
    changeLang = changeLang.bind(this);

    let form: FormT = {
        initials: [10, 0],
        steps: 100,
        stepSize: 0.01,
        equations: ["y(1 - y)", ""]
    }

    let fi: EvalSet = [];
    let truncated: [boolean, boolean] = [false, false];
    $: {
        if (!isInvalid(form)) {
            // Prepare the functions beforehand only once for all steps.
            fi = prepareEvalFunc(form.equations);
            let newSteps = generateSteps(form.steps, form.stepSize, form.initials, fi);
            // If there was no parsing error (which means that the user has finished typing).
            if (newSteps) {
                newSteps.forEach((sList, i) => {
                    if (sList.length <= form.steps) {
                        truncated[i] = true;
                    } else {
                        truncated[i] = false;
                    }
                });
                steps.set(newSteps);
                // console.log($steps);
            }
        }
    }
</script>

<main>
    <Header {changeLang} />
    <div>
        <Form bind:value={form} />
        <Preview equations={form.equations} />
        <Chart />
        <List h={form.stepSize} equations={form.equations} {truncated} />
    </div>
    <Info equations={form.equations} />
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

    :root {
        --background-color: #F0D1D1;
        --ui-color: #FFF0EB;
        --invalid-color: #f93e35;
        --border-radius: 12px;
        --shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
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