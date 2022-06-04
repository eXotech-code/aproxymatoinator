<script lang="ts">
    import Input from "./Input.svelte";
    import type { FormT } from "./types";
    import { lang } from "./stores";

    export let value: FormT;
    let init = ["2", "5"];
    $: {
        init.forEach((init, i) => {
            value.init[i] = parseInt(init);
        });
    };
    let n = "100";
    $: { value.n = parseFloat(n) };
    let h = "0.01";
    $: { value.h = parseFloat(h) };
</script>

<div>
    <Input id="eq1" bind:value={value.eqs[0]} label={$lang.equation_1Label} invalid={value.eqs[0] === ""} />
    <Input id="eq2" bind:value={value.eqs[1]} label={$lang.equation_2Label} invalid={value.eqs[1] === ""} />
    <Input id="init1" bind:value={init[0]} label={$lang.initialLabel_1} invalid={isNaN(value.init[0])} />
    <Input id="init2" bind:value={init[1]} label={$lang.initialLabel_2} invalid={isNaN(value.init[1])} />
    <Input id="n" bind:value={n} label={$lang.stepsLabel} invalid={isNaN(value.n)} />
    <Input id="h" bind:value={h} label={$lang.stepSizeLabel} invalid={isNaN(value.h)} />
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