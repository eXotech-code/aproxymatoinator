<script lang="ts">
    import Input from "./Input.svelte";
    import type { FormT } from "./types";
    import { lang } from "./stores";

    export let value: FormT;
    let initial = "10";
    $: { value.initial = parseInt(initial) };
    let steps = "100";
    $: { value.steps = parseFloat(steps) };
    let stepSize = "0.01";
    $: { value.stepSize = parseFloat(stepSize) };
</script>

<div>
    <Input id="equation" bind:value={value.equation} label={$lang.equationLabel} />
    <Input id="initial" bind:value={initial} label={$lang.initialLabel} />
    <Input id="steps" bind:value={steps} label={$lang.stepsLabel}/>
    <Input id="stepS" bind:value={stepSize} label={$lang.stepSizeLabel} />
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