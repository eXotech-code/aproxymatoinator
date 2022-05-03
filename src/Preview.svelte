<script lang="ts">
    import { renderToString } from "./common";

    export let equation: string;

    $: compiledEquation = renderToString(equation);
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
    }

    p {
        font-size: 2em;
    }
</style>