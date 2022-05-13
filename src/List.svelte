<script lang="ts">
    import { steps, lang } from "./stores";
    import Card from "./Card.svelte";
    import Button from "./Button.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";

    export let h: number
    export let equation: string;
    export let truncated: boolean;

    let collapsedAmount = 11;
    let customSteps;
    let expanded = false;
    $: {
        customSteps = $steps.slice(0, expanded ? $steps.length : collapsedAmount);
        console.log(customSteps);
    }
</script>

<div class="outer">
    {#if h}
        {#each customSteps as step, i}
            <Card {equation} {i}  x={step.x} />
        {/each}
    {/if}
    {#if truncated && $steps.length < collapsedAmount || truncated && expanded}
        <div>
            <p>{$lang.truncatedMessage}</p>
        </div>
    {/if}
    {#if $steps.length > collapsedAmount}
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
    }

    .outer > div:last-child {
        border-radius: 0 0 12px 12px;
    }
</style>