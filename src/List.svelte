<script lang="ts">
    import { steps, lang } from "./stores";
    import Card from "./Card.svelte";
    import Button from "./Button.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";

    export let h: number
    export let equation: string;

    let customSteps;
    let expanded = false;
    $: {
        customSteps = $steps.slice(0, expanded ? $steps.length : 11);
    }
</script>

<div class="outer">
    {#if h}
        {#each customSteps as step, i}
            <Card {equation} {i}  x={step.x} />
        {/each}
    {/if}
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
</div>

<style>
    .outer {
        box-shadow: var(--shadow);
        border-radius: 12px;
        display: flex;
        height: fit-content;
        flex-direction: column;
        grid-area: list;
        margin-bottom: 1rem;
    }

    .outer > div {
        background: var(--ui-color);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 0 12px 12px;
        padding: 1rem;
    }
</style>