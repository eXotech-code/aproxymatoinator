<script lang="ts">
    import Input from "./Input.svelte";
    import type { FormT } from "./types";
    import { lang } from "./stores";

    export let value: FormT;
    let initials = ["2", "5"];
    $: {
        initials.forEach((init, i) => {
            value.initials[i] = parseInt(init);
        });
    };
    let steps = "100";
    $: { value.steps = parseFloat(steps) };
    let stepSize = "0.01";
    $: { value.stepSize = parseFloat(stepSize) };
</script>

<div>
    <Input id="equation_1" bind:value={value.equations[0]} label={$lang.equation_1Label} invalid={value.equations[0] === ""} />
    <Input id="equation_2" bind:value={value.equations[1]} label={$lang.equation_2Label} invalid={value.equations[1] === ""} />
    <Input id="initial_1" bind:value={initials[0]} label={$lang.initialLabel_1} invalid={isNaN(value.initials[0])} />
    <Input id="initial_2" bind:value={initials[1]} label={$lang.initialLabel_2} invalid={isNaN(value.initials[1])} />
    <Input id="steps" bind:value={steps} label={$lang.stepsLabel} invalid={isNaN(value.steps)} />
    <Input id="stepS" bind:value={stepSize} label={$lang.stepSizeLabel} invalid={isNaN(value.stepSize)} />
</div>

<style>
    div {
        background: var(--ui-color);
        box-shadow: var(--shadow);
        padding: 1rem;
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        grid-area: form;
    }
</style>