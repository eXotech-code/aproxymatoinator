<script lang="ts">
    import { steps } from "./stores";
    import Card from "./Card.svelte";

    export let h: number
    export let equation: string;
</script>

<div>
    {#if h}
        {#each $steps as step, i}
            <Card {equation} {i}  x={step.x} />
        {/each}
    {/if}
</div>

<style>
    div {
        box-shadow: var(--shadow);
        border-radius: 12px;
        grid-column-start: 1;
        grid-row-end: span 2;
        display: flex;
        height: fit-content;
        flex-direction: column;
    }
</style>