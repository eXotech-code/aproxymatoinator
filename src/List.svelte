<script lang="ts">
    import { lang } from "./stores";
    import Card from "./Card.svelte";
    import Button from "./Button.svelte";
    import DropDown from "./DropDown.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";
    import type { Needs } from "./types";
    import { combinations } from "./common";

    export let equations: [string, string];
    export let numberOfSteps: number;
    export let system: boolean;
    export let needs: Needs; // Expresses a need for a certain function - method combination.
    export let steps; // Steps that this module expressed need for.

    let collapsedAmount = 11;
    let expanded = false;
    let customSteps = [];
    let truncated = false;
    $: { 
        if (steps) {
            customSteps = expanded ? steps : steps.slice(0, collapsedAmount);
            truncated = !(steps.length === numberOfSteps + 1);
        }
    };
    const functions = ["x(t)", "y(t)"];
    const methods = ["Euler", "Runge-Kutta"];
    let dropdowns = {
        function: functions[0],
        method: methods[0]
    };
    $: { needs = [dropdowns.function, dropdowns.method] };
    $: func = combinations.get(needs.join(""));
</script>

<div class="outer">
    <div class="dropdowns">
        <DropDown label={$lang.functionDropdown} options={system ? functions : functions.slice(0, 1)} bind:selected={dropdowns.function} />
        <DropDown label={$lang.methodDropdown} options={methods} bind:selected={dropdowns.method} />
    </div>
    {#if steps}
        {#each customSteps as step, i}
            <Card equation={equations[func]} {i} x={step.x} {system} {func} {steps} />
        {/each}
        {#if truncated && steps.length < collapsedAmount || truncated && expanded}
            <div>
                <p>{$lang.truncatedMessage}</p>
            </div>
        {/if}
        {#if steps.length > collapsedAmount}
            <div>
                <Button 
                    label={expanded ? $lang.collapseButton : $lang.expandButton}
                    func={() => expanded = !expanded}
                    {expanded}
                >
                    {#if expanded}
                        <MdExpandLess />
                    {:else}
                        <MdExpandMore />
                    {/if}
                </Button>
            </div>
        {/if}
    {/if}
</div>

<style>
    .outer {
        box-shadow: var(--shadow);
        display: flex;
        height: fit-content;
        flex-direction: column;
        grid-area: list;
        margin-bottom: 1rem;
        border-radius: 12px;
    }

    .outer > div {
        background: var(--ui-color);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        gap: 1rem;
    }

    .outer > div:last-child {
        border-radius: 0 0 12px 12px;
    }

    .outer > div:first-child {
        border-radius: 12px 12px 0 0;
    }

    .dropdowns {
        gap: 4rem;
    }
</style>