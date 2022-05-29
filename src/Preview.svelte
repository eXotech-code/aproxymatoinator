<script lang="ts">
    import { renderToString } from "./common";

    export let equations: [string, string];

    const compile = (eqs: [string, string]) => {
        let compiled = "";
        if (eqs[1]) {
            compiled = "\\begin{cases}";
            eqs.forEach((e, i) => {
                i===0 ? compiled += `x'(t) = ${e}\\\\` : compiled += `y'(t) = ${e}`;
            })
            compiled += "\\end{cases}";
        } else {
            compiled = `x' = ${eqs[0]}`
        }

        return renderToString(compiled);
    }

    $: compiledEquation = compile(equations);
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