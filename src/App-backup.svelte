<script lang="ts">
    import katex from "katex";
    import evaluatex from "../node_modules/evaluatex/dist/evaluatex.js";
    import { Chart, registerables } from "../node_modules/chart.js";
    import MdAdd from 'svelte-icons/md/MdAdd.svelte';
    import MdRemove from 'svelte-icons/md/MdRemove.svelte';
    import MdFlag from 'svelte-icons/md/MdFlag.svelte';
    import { onMount } from "svelte";

    Chart.register(...registerables);

    interface vals {
        x: number;
        f?: number;
        y: number; 
    }

    interface form {
        initial: number;
        steps: number;
        stepSize: number;
        equation: string;
    }

    const fillTemplate = (str: string, vals: object) => {
        const newStr = str.replace(/\${(.*?)}/g, (x, g) => vals[g]);
        return newStr;
    }

    const renderToString = (eq: string) => {
        return katex.renderToString(eq, { throwOnError: false, output: "mathml" });
    }

    class Language {
        // Localized text
        local = {
            equationLabel: ["Równanie różniczkowe", "Differential equation"],
            initialLabel: ["Wartość początkowa", "Initial value"],
            stepsLabel: ["Ilość kroków", "Number of steps"],
            stepSizeLabel: ["Wielkość kroku (h)", "Step size"],
            cardTitle: ["Krok", "Step"],
            moreButton: ["Pokaż więcej", "Show more"],
            lessButton: ["Pokaż mniej", "Show less"]
        }

        getLocalized(name: string, lan: number) {
            return this.local[name][lan];
        }
    }

    class Step {
        i: number;
        xVal: number;
        fVal: number;
        yVal: number;

        constructor(stepVals: vals) {
            const { x, f, y }: vals = stepVals;
            this.xVal = x;
            this.fVal = f;
            this.yVal = y;
        }

        changeExpState(expandedSteps: number[]) {
            const idx = expandedSteps.indexOf(this.i);
            if (idx === -1) {
                expandedSteps = [...expandedSteps, this.i];
            } else {
                // Remove the step from expanded list.
                expandedSteps = expandedSteps.filter(s => s !== this.i);
            }

            return expandedSteps;
        }

        expanded(expandedSteps) {
            return expandedSteps.indexOf(this.i) === -1 ? false : true;
        }
    }

    class Steps {
        evaluatexErrorCodes = new Map([
            ["Lexer error: reached end of stream", "LxErr"],
            ["Error: Symbol y is undefined or not a number", "SymUndef"],
            ["Error: Symbol x is undefined or not a number", "SymUndef"]
        ]);
        eq: string;
        stepList: Step[] = [];
        equationList = [];
        chartDataset: vals[] = [];
        h = 0;

        constructor(eq: string, stepNo: number, h: number, initialCond: number) {
            this.eq = eq;
            this.equationList = new Array(stepNo).fill(undefined);
            this.h = h;

            try {
                this.genSteps(stepNo, eq, initialCond)
            } catch(err) {
                console.log(err);
                this.h = 0;
                return this;
            }

            // Set all the indexes of steps.
            this.stepList.forEach(step => step.i = this.stepList.indexOf(step));

            // Generate the dataset for chart.
            this.chartDataset = this.makeChartDataset();
        }

        /* Build a template from a differential equation in order for the program to
           be able to substitute the values for x and y whenever needed */
        genTemplateEquation(i: number) {
            const tokens = { x: this.stepList[i].xVal, y: this.stepList[i].yVal, e: Math.E };
            const replaced = this.eq.replace(/(\\[A-Za-z]+{)|([xy])/g, (x, trash, idx) => tokens[idx]);

            return replaced;
        }

        calcFromEq(eq: string, x: number, y: number) {
            try {
                let fi = evaluatex(eq, {x: x, y: y, e: Math.E}, {latex: true});
                return fi();
            } catch (err) {
                if (this.evaluatexErrorCodes.get(err)) {
                    throw this.evaluatexErrorCodes.get(err);
                } else {
                    throw err;
                }
            }
        }

        genSteps(amount: number, eq: string, initial: number) {
            let y: number, f: number, x: number;

            for (let i = 0; i <= amount; i++) {
                x = parseFloat((this.h * i).toFixed(3));
                // Calculate y_i
                y = parseFloat((i === 0 ? initial : this.stepList[i-1].yVal + this.h*this.stepList[i-1].fVal).toFixed(3));
                
                // Calculate f_i
                try {
                    f = this.calcFromEq(eq, x, y);
                } catch (err) {
                    throw err;
                }

                // Create a new step with those values.
                this.stepList.push(new Step({ x: x, f: f, y: y }));
            }

            return 0;
        }

        // Generates equations for a specified step and saves them into array for later use.
        // If an equation is already in list, it returns it.
        genEquations(i: number, expanded: boolean) {
            const eqY = ["y_{${i}} = ${yPrev} + ${h} \\cdot ${fPrev} = ${y}", "y_{${i}} = ${y}"];
            const eqF = ["f_{${i}} = f(${x}, ${y}) = ${eqSubs} = ${f}", "f_{${i}} = ${f}"];
            let resY: string, resF: string;

            if (expanded) {
                resY = fillTemplate(
                    eqY[0],
                    { 
                        i: i,
                        yPrev: this.stepList[i-1].yVal,
                        h: this.h,
                        fPrev: this.stepList[i-1].fVal,
                        y: this.stepList[i].yVal
                    }
                );
                // Equation with substituted variable names.
                resF = fillTemplate(
                    eqF[0],
                    {
                        i: i,
                        x: this.stepList[i].xVal,
                        y: this.stepList[i].yVal,
                        eqSubs: this.genTemplateEquation(i),
                        f: parseFloat(this.stepList[i].fVal.toFixed(3))
                    }
                );
            } else {
                resY = fillTemplate(
                    eqY[1],
                    {
                        i: i,
                        y: this.stepList[i].yVal
                    }
                )
                resF = fillTemplate(
                    eqF[1],
                    {
                        i: i,
                        f: parseFloat(this.stepList[i].fVal.toFixed(3))
                    }
                )
            }
            
            this.equationList[i] = [renderToString(resY), renderToString(resF)];
            return this.equationList[i];
        }

        makeChartDataset() {
            let res: vals[] = [];
            this.stepList.forEach(step => res.push({ x: step.xVal, y: step.yVal }));
            
            return res;
        }

        createChart(ctx: CanvasRenderingContext2D, chart: Chart) {
            // Remove the old chart if exists.
            this.removeChart(chart);
            return new Chart(ctx, {
                type: "line",
                data: {
                    labels: stepObj.chartDataset.map(obj => obj.x),
                    datasets: [{
                        label: "y(x)",
                        data: stepObj.chartDataset
                    }]
                },
                options: {
                    elements: {
                        point: {
                            backgroundColor: "#51D4FF",
                            borderWidth: 0
                        },
                        line: {
                            backgroundColor: "#51D4FF",
                            borderColor: "#ADEBFF"
                        }
                    },
                    scales: {
                        x: { min: 0 },
                        y: { min: 0 }
                    }
                }
            });
        }

        removeChart(chart: Chart) {
            if (chart) chart.destroy();
        }
    }

    let chart: Chart;
    let chartCanvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    onMount(() => {
        ctx = chartCanvas.getContext("2d");
    });
    let htmlPreview: string;
    let stepObj: Steps;
    // Values gotten from input boxes.
    let formVals: form = { initial: 10, steps: 100, stepSize: 0.01, equation: "y(1 - y)" }
    $: {
        htmlPreview = katex.renderToString(`y' = ${formVals.equation}`, { throwOnError: false, output: "mathml" });
        stepObj = new Steps(formVals.equation, formVals.steps, formVals.stepSize, formVals.initial);
        formVals.equation = formVals.equation.replaceAll("y' = ", "");
        chart = stepObj.createChart(ctx, chart);
    };

    let expandedSteps = [];

    let locale = new Language;
    let lan = 0;
</script>

<main>
    <header>
	    <h1>Aproxymatoinator</h1>
        <button on:click={() => { lan ? lan = 0 : lan = 1 }}>
            <div class="icon">
                <MdFlag />
            </div>
            <p>{lan ? "Polski" : "English"}</p>
        </button>
    </header>
    <div>
        <div class="form">
            <div>
                <input id="eq" required bind:value={formVals.equation}>
                <label for="eq">{locale.getLocalized("equationLabel", lan)}</label>
            </div>
            <div>
                 <input id="initial" type=number required bind:value={formVals.initial}>
                 <label for="initial">{locale.getLocalized("initialLabel", lan)}</label>
            </div>
            <div>
                <input id="steps" type=number min=10 max=10000 required bind:value={formVals.steps}>
                <label for="steps">{locale.getLocalized("stepsLabel", lan)}</label>
            </div>
            <div>
                <input id="stepS" type=number min=0 max=10 step=0.01 required bind:value={formVals.stepSize}>
                <label for="stepS">{locale.getLocalized("stepSizeLabel", lan)}</label>
            </div>
        </div>
        <div class="preview">
            <p>{@html htmlPreview}</p>
        </div>
        <div class="table">
            {#if stepObj.h}
                {#each stepObj.stepList as step}
                    <div>
                        <div class="information">
                            <p class="card-title">{`${locale.getLocalized("cardTitle", lan)}: ${step.i}`}</p>
                            <div class={ step.expanded(expandedSteps) ? "expanded" : "" }>
                                <p>{@html renderToString(`x_{${step.i}} = ${step.xVal}`)}</p>
                                {#each stepObj.genEquations(step.i, step.expanded(expandedSteps)) as eq}
                                    <p>{@html eq}</p>
                                {/each}
                            </div>
                        </div>
                        <div class="interaction">
                            {#if step.i}
                                <button
                                    class={ step.expanded(expandedSteps) ? "expanded" : "" }
                                    on:click={() => { expandedSteps = step.changeExpState(expandedSteps) }}
                                >
                                    <div class="icon">
                                        {#if step.expanded(expandedSteps)}
                                            <MdRemove />
                                        {:else}
                                            <MdAdd />
                                        {/if}
                                    </div>
                                    <p>{step.expanded(expandedSteps) ? locale.getLocalized("lessButton", lan) : locale.getLocalized("moreButton", lan)}</p>
                                </button>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="graph">
            <div>
                <canvas width=100 height=100 bind:this={chartCanvas}></canvas>
            </div>
        </div>
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

    header {
        display: flex;
        justify-content: space-between;
        width: 96%;
        padding: 1rem;
    }

	h1 {
		color: #3A445D;
        font-size: 2em;
		font-weight: 400;
        margin: 0;
	}

    p {
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
    }

    input {
        color: #3A445D;
        background: none;
        border: none;
        outline: none;
        padding: 1rem 0.75rem;
        width: 100%;
        height: 100%;
    }

    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input:focus,
    input:valid {
        transform: translateY(18%);
        transition: transform 0.25s ease-out;
    }

    input:focus + label,
    input:valid + label {
        color: #FF7547;
        transform: translateY(-68%) scale(0.75);
        transform-origin: top left;
        transition: transform 0.25s ease-out, color 0.25s ease-out;
    }

    label {
        position: absolute;
        display: block;
        padding: 0.75rem;
        top: 50%;
        left: 0;
        transform: translateY(-52%);
        transform-origin: top left;
        transition: transform 0.25s ease-out, color 0.25s ease-out;
    }

    button {
        color: #00B8F5;
        background: #f3e5e0;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        padding: 0.5rem 1.5rem 0.5rem 1rem;
        gap: 0.5rem;
        height: 2.5rem;
        border: none;
        border-radius: 100px;
    }

    button:hover {
        background: #def7ff;
        transition: background 0.25s ease-in-out;
    }

    button:active {
        filter: brightness(88%);
    }

    button.expanded {
        color: #E34F9B;
    }

    .form {
        background: var(--ui-color);
        box-shadow: var(--shadow);
        padding: 1rem;
        border-radius: var(--border-radius);
        grid-column-start: 1;
        grid-row-start: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form > div {
        background: #FFE0D6;
        border-bottom: 1px solid #3A445D;
        border-radius: 4px 4px 0 0;
        position: relative;
        height: fit-content;
    }

    .form > div:focus-within {
        border-bottom: 1px solid #FF7547;
        transition: border-bottom 0.25s ease-out;
    }

    .preview {
        background: var(--ui-color);
        box-shadow: var(--shadow);
        padding: 1rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview > p {
        font-size: 2em;
    }

    .table {
        box-shadow: var(--shadow);
        border-radius: 12px;
        grid-column-start: 1;
        grid-row-end: span 2;
        display: flex;
        /* gap: 1rem; */
        flex-direction: column;
    }

    .table > div {
        /* border: 1px solid var(--background-color); */
        background: var(--ui-color);
        min-width: 0;
        padding: 0.5rem 1rem;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
    }

    .table > div:last-child {
        border-radius: 0 0 12px 12px;
    }

    .table > div:first-child {
        border-radius: 12px 12px 0 0;
    }

    .table > div:hover {
        filter: brightness(98%);
    }

    .card-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
    }

    .information {
        width: 60%;
    }

    .information > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        overflow-x: auto;
    }

    .information > div.expanded {
        flex-direction: column;
        justify-content: start;
        transition: flex-direction 0.5s ease;
    }

    .interaction {
        align-self: flex-end;
        display: flex;
        justify-items: flex-end;
    }

    .graph {
        background: var(--ui-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        position: relative;
        grid-column-start: 2;
        grid-row-start: 2;
    }

    .graph::before {
        content: "";
        display: block;
        padding-top: 100%;
    }

    .graph > div {
        position: absolute;
        top: 5%;
        left: 5%;
        bottom: 5%;
        right: 5%;
    }

    .icon {
        width: 1rem;
        height: 1rem;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
