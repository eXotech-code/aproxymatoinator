<script lang="ts">
    import type { Step, FormT } from "./types";
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
    const generateSteps = (stepN: number, h: number, initial: number, fi: (variables: object) => number) => {
        if (!fi) return undefined;
        let steps: Step[] = [];

        let y: number, f: number, x: number;

            for (let i = 0; i <= stepN; i++) {
                x = parseFloat((h * i).toFixed(3));
                // Calculate y_i
                y = parseFloat((i === 0 ? initial : steps[i-1].y + h*steps[i-1].f).toFixed(3));

                /* If computed y value exceeds biggest possible integers size
                 * we will just stop the computation here and set the variable
                 * that will show that fact on the list of values */
                if (y >= Number.MAX_SAFE_INTEGER) {
                    break;
                }
                
                // Calculate f_i
                try {
                    f = fi({x: x, y: y, e: Math.E});
                } catch (err) {
                    console.log(err);
                    return undefined;
                }

                // Create a new step with those values.
                steps = [...steps, { x: x, y: y, f: f }];
            }

        return steps;
    }

    let langId = 0;
    let changeLang = () => {
        langId ? langId = 0 : langId = 1;
        lang.update(() => new Locale(langId));
    }
    changeLang = changeLang.bind(this);

    let form: FormT = {
        initial: 10,
        steps: 100,
        stepSize: 0.01,
        equation: "y(1 - y)"
    }

    $: invalid = Object.values(form).includes(NaN) || Object.values(form).includes("");
    
    let fi;
    let truncated = false;
    $: {
        if (!invalid) {
            // Prepare the function beforehand only once for all steps.
            try {
                fi = evaluatex(form.equation, {latex: true});
            } catch (err) {
                if (evaluatexErrorCodes.get(err)) {
                    console.log(evaluatexErrorCodes.get(err));
                } else {
                    console.log(err);
                }
                fi = undefined;
            }
            let newSteps = generateSteps(form.steps, form.stepSize, form.initial, fi);
            // If there was no parsing error (which means that the user has finished typing).
            if (newSteps) {
                if (newSteps.length < form.steps + 1) {
                    truncated = true;
                } else {
                    truncated = false;
                }
                steps.set(newSteps);
            }
        }
    }
</script>

<main>
    <Header {changeLang} />
    <div>
        <Form bind:value={form} />
        <Preview equation={form.equation} />
        <Chart />
        <List h={form.stepSize} equation={form.equation} {truncated} />
    </div>
    <Info />
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