<script lang="ts">
    import type { StepVals, Step } from "./types";
    import { onMount } from "svelte";
    import { Chart, registerables } from "../node_modules/chart.js";
    import { steps } from "./stores";
    
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

    let chart: Chart;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    onMount(() => context = canvas.getContext("2d"));
    let datasets: StepVals;
    $: {
        datasets = [[],[]];
        $steps.forEach((s, i) => {
            if (s.length) s.forEach(s => {
                datasets[i] = [...datasets[i], { x: s.x, y: s.y }];
            });
        })

        // --- DEBUG ---
        console.log(datasets[0].length === $steps[0].length, datasets[0].length);
        let same = true;
        for (let i = 0; i < datasets.length; i++) {
            for (let j = 0; j < datasets[i].length; j++) {
                // Check if the values in the dataset are the same as in
                // the step store.
                if (datasets[i][j].x !== $steps[i][j].x || datasets[i][j].y !== $steps[i][j].y) {
                    same = false;
                }
            }
            console.log(same);
        }
        // !--- DEBUG ---!

        chart = createChart(context, chart, datasets);
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
        grid-area: chart;
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