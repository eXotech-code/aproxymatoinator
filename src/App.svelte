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

    const generateSteps = (eq: string, stepN: number, h: number, initial: number) => {
        let steps: Step[] = [];

        let y: number, f: number, x: number;

            for (let i = 0; i <= stepN; i++) {
                x = parseFloat((h * i).toFixed(3));
                // Calculate y_i
                y = parseFloat((i === 0 ? initial : steps[i-1].y + h*steps[i-1].f).toFixed(3));
                
                // Calculate f_i
                try {
                    let fi = evaluatex(eq, {x: x, y: y, e: Math.E}, {latex: true});
                    f = fi();
                } catch (err) {
                    if (evaluatexErrorCodes.get(err)) {
                        console.log(evaluatexErrorCodes.get(err));
                    } else {
                        console.log(err);
                    }
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
    
    $: {
        let newSteps = generateSteps(form.equation, form.steps, form.stepSize, form.initial);
        // If there was no parsing error (which means that the user has finished typing).
        if (newSteps) {
            steps.set(newSteps);
        }
        console.log($steps);
    }
</script>

<main>
    <Header {changeLang} />
    <div>
        <Form bind:value={form} />
        <Preview equation={form.equation} />
        <List h={form.stepSize} equation={form.equation} />
        <Chart />
    </div>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

    :root {
        --background-color: #F0D1D1;
        --ui-color: #FFF0EB;
        --border-radius: 12px;
        --shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    }

    :global(body) {
        background: var(--background-color);
        padding: 0;
    }

    @media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

    main {
        font-family: 'Roboto', sans-serif;
		margin: 0 auto;
	}

    main > div {
        display: grid;
        padding: 1rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: max-content max-content 1fr;
        gap: 1rem;
    }
</style>