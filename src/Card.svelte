<script lang="ts">
    import type { Step } from "./types";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";
    import MdRemove from "svelte-icons/md/MdRemove.svelte";
    import { renderToString, fillTemplate, genTemplateEquation } from "./common";
    import { lang, steps } from "./stores";
    import Button from "./Button.svelte";

    export let i: number;
    export let x: number;
    export let equation: string;

    // Generates equations for a specified step and saves them into array for later use.
    // If an equation is already in list, it returns it.
    const genEquations = (i: number, expanded: boolean, steps: Step[]) => {
        const eqY = ["y_{${i}} = ${yPrev} + ${h} \\cdot ${fPrev} = ${y}", "y_{${i}} = ${y}"];
        const eqF = ["f_{${i}} = f(${x}, ${y}) = ${eqSubs} = ${f}", "f_{${i}} = ${f}"];
        let resY: string, resF: string;
        if (expanded) {
            resY = fillTemplate(
                eqY[0],
                { 
                    i: i,
                    yPrev: steps[i-1].y,
                    h: steps[i].x / i,
                    fPrev: steps[i-1].f,
                    y: steps[i].y
                }
            );
            // Equation with substituted variable names.
            resF = fillTemplate(
                eqF[0],
                {
                    i: i,
                    x: steps[i].x,
                    y: steps[i].y,
                    eqSubs: genTemplateEquation(equation, steps, i),
                    f: parseFloat(steps[i].f.toFixed(3))
                }
            );
        } else {
            resY = fillTemplate(
                eqY[1],
                {
                    i: i,
                    y: steps[i].y
                }
            )
            resF = fillTemplate(
                eqF[1],
                {
                    i: i,
                    f: parseFloat(steps[i].f.toFixed(3))
                }
            )
        }
        
        const eqs: string[] = [renderToString(resY), renderToString(resF)];
        return eqs;
    }

    let expanded = false;
    $: currentEquations = genEquations(i, expanded, $steps);
</script>

<div class="card">
    <div class="information">
        <p class="card-title">{`${$lang.cardTitle}: ${i}`}</p>
        <div class={ expanded ? "expanded" : "" }>
            <p>{@html renderToString(`x_{${i}} = ${x}`)}</p>
            {#each currentEquations as eq}
                <p>{@html eq}</p>
            {/each}
        </div>
    </div>
    <div class="interaction">
        {#if i}
            <Button
                label={ expanded ? $lang.lessButton : $lang.moreButton }
                func={ () => expanded = !expanded }
                expanded
            >
                {#if expanded}
                    <MdRemove />
                {:else}
                    <MdAdd />
                {/if}
            </Button>
        {/if}
    </div>
</div>

<style>
    @media screen and (min-width: 600px) {
        .information > div {
            flex-direction: row;
        }
    }

    @media screen and (max-width: 600px) {
        .information > div {
            flex-direction: column;
        }
    }

    .card {
        background: var(--ui-color);
        min-width: 0;
        padding: 0.5rem 1rem;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
    }

    .card:last-child {
        border-radius: 0 0 12px 12px;
    }

    .card:first-child {
        border-radius: 12px 12px 0 0;
    }

    .card:hover {
        filter: brightness(98%);
    }

    .card-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
    }

    .information {
        max-width: 40vw;
    }

    .information > div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        overflow-x: auto;
    }

    .information > div.expanded {
        flex-direction: column;
        justify-content: start;
        transition: flex-direction 0.5s ease;
    }

    .interaction {
        align-self: flex-end;
        display: flex;
        justify-items: flex-end;
    }
</style>