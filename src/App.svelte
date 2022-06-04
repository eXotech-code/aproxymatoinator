<script lang="ts">
    import type { Step, FormT, EvalSet, ComponentStep, ChartSteps } from "./types";
    import evaluatex from "../node_modules/evaluatex/dist/evaluatex.js";
    import Header from "./Header.svelte";
    import Form from "./Form.svelte";
    import List from "./List.svelte";
    import Preview from "./Preview.svelte";
    import Chart from "./Chart.svelte";
    import { lang } from "./stores";
    import Locale from "./locale";
    import { evaluatexErrorCodes, options } from "./common";
    import Info from "./Info.svelte";

    const isValid = (f: FormT) => {
        let valid = true;
        let vals = Object.values(f);
        vals.forEach((v, i) => {
            if ((i === 0 || i === vals.length-1) && (v[0] === NaN || v[0] === "")) {
                valid = false;
            } else if (form.eqs[1] && form.init[1] === NaN) {
                valid = false;
            } else {
                if (v === NaN) {
                    valid = false;
                }
            }
        });

        return valid;
    }

    const prepareEvalFunc = (form: FormT) => {
        let fi = [undefined, undefined];
        if (isValid(form)) {
            try {
                form.eqs.forEach((e, i) => {
                    if (e) {
                        fi[i] = evaluatex(e, { latex: true });
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
            }
        }

        return fi;
    }

    const makeStep = (i: number, initials: [number, number], h: number, steps: Step[], fi: EvalSet, mode: number) => {
        let [x, y] = initials;
        let t = h * i;
        let fx = [];
        let fy = [];

        if (i > 0) {
            const oldStep = steps[i-1];
            const oldX = oldStep.x;
            const oldY = oldStep.y;
            const oldT = oldStep.t;
            fx = [h * fi[0]({ t: oldT, x: oldX, y: oldY, e: Math.E })];
            fy = [h * fi[1]({ t: oldT, x: oldX, y: oldY, e: Math.E })];
            if (mode === 0) {
                x = oldX + fx[0];
                y = oldY + fy[0];
            } else {
                // Runge-Kutta
                let fxSum = fx[0]; // <--- Add the result of first computation at start.
                let fySum = fy[0]; // <----┘
                let inputT: number;
                let inputX: number;
                let inputY: number;
                let newX: number;
                let newY: number;
                let before4: boolean;

                for (let j = 1; j < 4; j++) {
                    before4 = j < 3;

                    if (before4) {
                        inputT = oldT + h/2;
                        inputX = oldX + (fx[j-1] / 2);
                        inputY = oldY + (fy[j-1] / 2);
                    } else {
                        inputT = oldT + h;
                        inputX = oldX + fx[j-1];
                        inputY = oldY + fy[j-1];
                    }

                    console.log(j-1, fx[j-1], inputX, before4);

                    newX = h * fi[0]({ t: inputT, x: inputX, y: inputY, e: Math.E});
                    fx.push(newX);
                    fxSum += before4 ? 2 * newX : newX;

                    newY = h * fi[1]({ t: inputT, x: inputX, y: inputY, e: Math.E});
                    fy.push(newY);
                    fySum += before4 ? 2 * newY : newY;
                }

                x = oldX + 1/6 * (fxSum);
                y = oldY + 1/6 * (fySum);
            }
        }

        return { t: t, x: x, y: y, fx: fx, fy: fy };
    }

    // Generates a list of steps based on a certain requirement.
    const generateSteps = (n: number, h: number, initials: [number, number], fi: EvalSet, mode: number) => {
        if (!fi[0]) return undefined;

        let tainted = false;
        let steps: Step[] = [];
        let newStep: Step;

        for (let i = 0; i <= n; i++)
        if (!tainted) {
            newStep = makeStep(i, initials, h, steps, fi, mode);
            /* If computed y value exceeds biggest possible integers size
             * we will just stop the computation here and set the variable
             * that will show that fact on the list of values */
            if (newStep.y >= Number.MAX_SAFE_INTEGER || newStep.x >= Number.MAX_SAFE_INTEGER) {
                tainted = true;
            }

            // Create a new step with those values.
            steps = [...steps, newStep];
        }

        // Truncate decimal places down to three for viewing purposes.
        steps.forEach((step, i) => {
            Object.entries(step).forEach(ent => { 
                let val = ent[1];
                if (Array.isArray(val)) {
                    val.forEach((v, j)  => {
                        steps[i][ent[0]][j] = parseFloat(v.toFixed(3));
                    });
                } else {
                    steps[i][ent[0]] = parseFloat(val.toFixed(3));
                }
            });
        });

        console.log(steps);

        return steps;
    }

const generateRequired = (form: FormT, fi: EvalSet, options: string[], requirements: string[] | string) => {
     let generated;
     let final;

     if (isValid(form)) {
        if (Array.isArray(requirements)) {
            final = [];
            requirements.forEach(req => {
                const mode = options.indexOf(req) < 2 ? 0 : 1;
                generated = generateSteps(form.n, form.h, form.init, fi, mode);
                const isY = !!((options.indexOf(req) + 1) % 2);
                if (isY) {
                    final.push(generated.map(g => {
                        return { t: g.t, y: g.y, ft: g.fy };
                    }));
                } else {
                    final.push(generated.map(g => {
                        return { t: g.t, y: g.x, ft: g.fx };
                    }));
                }
            });
        } else {
            const mode = options.indexOf(requirements) < 2 ? 0 : 1;
            generated = generateSteps(form.n, form.h, form.init, fi, mode);
            const isY = !!(options.indexOf(requirements) % 2);
            if (isY) {
                final = generated.map(g => {
                    return { t: g.t, y: g.y, ft: g.fy };
                })
            } else {
                final = generated.map(g => {
                    return { t: g.t, y: g.x, ft: g.fx };
                })
            }
        }
     }

     return final;
}

    let langId = 0;
    let changeLang = () => {
        langId ? langId = 0 : langId = 1;
        lang.update(() => new Locale(langId));
    }
    changeLang = changeLang.bind(this);

    let form: FormT = {
        init: [2, 5],
        n: 100,
        h: 0.01,
        eqs: ["3x+y", "x+3y"]
    }

    let listRequires = options[0];
    let chartRequires: [string, string] = [options[0], options[1]];

    // Prepare the functions beforehand only once for all steps.
    $: fi = prepareEvalFunc(form);
</script>

<main>
    <Header {changeLang} />
    <div>
        <Form bind:value={form} />
        <Preview equations={form.eqs} />
        <Chart steps={generateRequired(form, fi, options, chartRequires)} bind:requirements={chartRequires} />
        <List
            n={form.n}
            steps={generateRequired(form, fi, options, listRequires)}
            bind:requirement={listRequires}
        />
    </div>
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
