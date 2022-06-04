<script lang="ts">
    import { lang } from "./stores";
    import { fillTemplate, options, renderToString, genTemplateEquation } from "./common";
    import type { ComponentSteps } from "./types";
    import Card from "./Card.svelte";
    import Button from "./Button.svelte";
    import DropDown from "./DropDown.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";

    export let n: number;
    export let steps: ComponentSteps;
    export let requirement = options[0];

    const equations = (steps: ComponentSteps, requirement: string) => {
        const splitted = requirement.split(" ");
        const f = splitted[0];
        let eqs = [];

       steps.forEach((s, i) => {
            let step = [renderToString(`t_{${i}} = ${s.t}`)];
            s.ft.forEach((k, j) => {
                step.push(renderToString(`k_{${j}} = ${k}`));
            })
            const currentFunction = f.replace("t", `x_{${i}}, y_{${i}}`);
            step.push(renderToString(`${currentFunction} = ${s.y}`));
            eqs.push(step);
       }) 

       return eqs;
    }

    let collapsedAmount = 11;
    let expanded = false;
    let customSteps = [];
    let truncated = false;
    let eqs: Array<Array<string>>;
    $: {
        if (steps) {
            customSteps = expanded ? steps : steps.slice(0, collapsedAmount);
            truncated = !(steps.length === n + 1);
            eqs = equations(customSteps, requirement);
        }
    };
</script>

<div class="outer">
    <div class="dropdowns">
        <DropDown label={$lang.listDropdown} {options} bind:selected={requirement} />
    </div>
    {#if steps}
        {#each eqs as e, i}
            <Card {i} equations={e} />
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

    /* .dropdowns {
        gap: 4rem;
    } */
</style>
