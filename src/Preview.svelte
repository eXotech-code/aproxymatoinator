<script lang="ts">
    import { renderToString } from "./common";

    export let equation: string;

    $: compiledEquation = renderToString(`y' = ${equation}`);
</script>

<div>
    <p>{@html compiledEquation}</p>
</div>

<style>
    div {
        background: var(--ui-color);
        box-shadow: var(--shadow);
        padding: 1rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: preview;
    }

    p {
        font-size: 2em;
    }
</style>