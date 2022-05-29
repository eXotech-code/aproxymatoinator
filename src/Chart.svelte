<script lang="ts">
    import type { ChartNeeds, StepVals } from "./types";
    import { onMount } from "svelte";
    import { Chart, registerables } from "../node_modules/chart.js";
    import { lang } from "./stores";
    import DropDown from "./DropDown.svelte";

    export let system: boolean;
    export let stepSet: StepVals;
    export let needs: ChartNeeds;
    
    Chart.register(...registerables);

    const deleteChart = (chart: Chart) => {
        if (chart) chart.destroy();
    }

    const chartDataFields = (datasets: StepVals) => {
        const colors = ["#51D4FF", "#FF7547"];
        const borders = ["#ADEBFF", "#faaa8e"]
        const labels = ["x(t)", "y(t)"];
        let dataFields = [];
        datasets.forEach((s, i) => {
            if (s.length) {
                dataFields.push({
                    label: labels[i],
                    data: s,
                    backgroundColor: colors[i],
                    borderColor: borders[i]
                });
            }
        });

        return dataFields;
    }

    const createChart = (ctx: CanvasRenderingContext2D, chart: Chart, datasets: StepVals) => {
        if (!ctx) return undefined;
        deleteChart(chart);
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: datasets[0].map(vs => vs.x),
                datasets: chartDataFields(datasets)
            },
            options: {
                elements: {
                    point: {
                        borderWidth: 0
                    }
                },
                scales: {
                    x: { min: 0 },
                    y: { min: 0 }
                }
            }
        });
    }

    /* Removes option selected in another dropdown to
     * prevent selecting two same things at once. */
    const removeSelected = (options: string[], otherSelection: string) => {
        /* Deep copy because normally the base array
         * would get modified by splice. */
        let optionsCopy = JSON.parse(JSON.stringify(options));
        let index = options.indexOf(otherSelection);
        if (index === -1) {
            return options
        };
        optionsCopy.splice(index, 1);
        return optionsCopy;
    }

    let chart: Chart;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    onMount(() => context = canvas.getContext("2d"));
    let datasets: StepVals = [[],[]];
    $: {
        stepSet.forEach((s, i) => {
            if (s.length) s.forEach(s => {
                datasets[i] = [...datasets[i], { x: s.x, y: s.y }];
            });
        })

        chart = createChart(context, chart, datasets);
    }

    const allOptions = ["x(t) Euler", "y(t) Euler", "x(t) Runge-Kutta", "y(t) Runge-Kutta", "Nothing"];
    $: options = system ? allOptions : [allOptions[0], allOptions[2], allOptions[4]];
    const noNeed = "Nothing";
    let selected = [allOptions[0], noNeed];
    $: {    
        let nextNeed;
        selected.forEach((s, i) => {
            nextNeed = s.split(" ");
            if (s === noNeed) {
                nextNeed = Array(2).fill(noNeed);
            }
            needs[i] = nextNeed;
        });
    };
</script>

<div class="outer">
    <div class="dropdowns">
        <DropDown
            label="Compare"
            options={removeSelected(options, selected[1])}
            bind:selected={selected[0]}
        />
        <DropDown
            label="To"
            options={removeSelected(options, selected[0])}
            bind:selected={selected[1]}
        />
    </div>
    <div class="chart-holder">
        <div class="chart">
            <canvas width=100 height=100 bind:this={canvas}></canvas>
        </div>
    </div>
</div>

<style>
    .outer {
        background: var(--ui-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        grid-area: chart;
    }

    .dropdowns {
        gap: 1rem;
        display: flex;
        justify-content: center;
        padding: 1rem;
    }

    .chart-holder {
        position: relative;
    }

    .chart-holder::before {
        content: "";
        display: block;
        padding-top: 100%;
    }

    .chart-holder > .chart {
        position: absolute;
        top: 5%;
        left: 5%;
        bottom: 5%;
        right: 5%;
    }
</style>