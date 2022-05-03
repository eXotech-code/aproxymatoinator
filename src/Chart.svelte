<script lang="ts">
    import type { Step } from "./types";
    import { onMount } from "svelte";
    import { Chart, registerables } from "../node_modules/chart.js";
    import { steps } from "./stores";
    
    Chart.register(...registerables);

    const deleteChart = (chart: Chart) => {
        if (chart) chart.destroy();
    }

    const createChart = (ctx: CanvasRenderingContext2D, chart: Chart, dataset: Step[]) => {
        if (!ctx) return undefined;
        deleteChart(chart);
        return new Chart(ctx, {
                type: "line",
                data: {
                    labels: dataset.map(vs => vs.x),
                    datasets: [{
                        label: "y(x)",
                        data: dataset
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

    let chart: Chart;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    onMount(() => context = canvas.getContext("2d"));
    let dataset: Step[] = [];
    $: {
        dataset = [];
        if ($steps.length) $steps.forEach(s => dataset = [...dataset, { x: s.x, y: s.y }]);
        chart = createChart(context, chart, dataset);
    }
</script>

<div class="outer">
    <div>
        <canvas width=100 height=100 bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .outer {
        background: var(--ui-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        position: relative;
        grid-column-start: 2;
        grid-row-start: 2;
    }

    .outer::before {
        content: "";
        display: block;
        padding-top: 100%;
    }

    .outer > div {
        position: absolute;
        top: 5%;
        left: 5%;
        bottom: 5%;
        right: 5%;
    }
</style>