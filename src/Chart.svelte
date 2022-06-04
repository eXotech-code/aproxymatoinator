<script lang="ts">
    import type { Dataset, Step, ChartSteps } from "./types";
    import { onMount } from "svelte";
    import { Chart, registerables } from "../node_modules/chart.js";
    import { lang } from "./stores";
    import DropDown from "./DropDown.svelte";
    import { options } from "./common";

    export let steps: ChartSteps;
    export let requirements: [string, string] = [options[0], options[1]];

    Chart.register(...registerables);

    const deleteChart = (chart: Chart) => {
        if (chart) {
            chart.destroy();
            return 0;
        }
        return 1;
    }

    const makeDataset = (steps: ChartSteps) => {
        let dataset: Dataset = [[],[]];
        steps.forEach((set, i) => {
            set.forEach(s => {
                dataset[i].push(s.y);
            });
        });
        return dataset;
    }

    const makeLabels = (steps: ChartSteps) => {
        return steps[0].map(s => s.t);
    }

    const chartDataFields = (dataset: Dataset, requirements: [string, string]) => {
        const colors = ["#51D4FF", "#FF7547"];
        const borders = ["#ADEBFF", "#faaa8e"]
        let labels = requirements;
        let dataFields = [];
        dataset.forEach((elem, i) => {
           dataFields.push({
               label: labels[i],
               data: elem,
               backgroundColor: colors[i],
               borderColor: borders[i]
           });
        });

        return dataFields;
    }

    const createChart = (ctx: CanvasRenderingContext2D, chart: Chart, dataset: Dataset, labels: number[], requirements: [string, string]) => {
        if (!ctx) return undefined;
        if (chart) deleteChart(chart)
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: chartDataFields(dataset, requirements)
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

    const removeSelected = (options: string[], otherSelected: string) => {
        let optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(options.indexOf(otherSelected), 1);
        return optionsCopy;
    }

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    onMount(() => context = canvas.getContext("2d"));
    $: dataset = makeDataset(steps);
    $: labels = makeLabels(steps);
    $: chart = createChart(context, chart, dataset, labels, requirements);
</script>

<div class="outer">
    <div class="dropdowns">
        <DropDown
             label={$lang.comparisonDropdown1}
             options={removeSelected(options, requirements[1])}
             bind:selected={requirements[0]}
             />
             <DropDown
             label={$lang.comparisonDropdown2}
             options={removeSelected(options, requirements[0])}
             bind:selected={requirements[1]}
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
