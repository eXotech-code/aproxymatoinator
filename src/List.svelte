<script lang="ts">
    import { steps, lang } from "./stores";
    import Card from "./Card.svelte";
    import Button from "./Button.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";
    import MdFunctions from "svelte-icons/md/MdFunctions.svelte";

    export let h: number
    export let equations: [string, string];
    export let truncated: [boolean, boolean];

    let func = 0; // The currently visible function
    let collapsedAmount = 11;
    let customSteps = [[],[]];
    let expanded = false;
    $: {
        $steps.forEach((s, i) => {
            customSteps[i] = s.slice(0, expanded ? s.length : collapsedAmount);
        });
    }
    const msg = "Pokaż funkcję ";
    const functions = ["x(t)", "y(t)"];
</script>

<div class="outer">
    <div>
        <p>Lista kroków dla funkcji {functions[func]}</p>
        {#if customSteps[1].length}
            <Button label={`${msg}${functions[+!func]}`}
                func={() => func ? func = 0 : func = 1}
                expanded={func ? true : false}
            >
                <MdFunctions />
            </Button>
        {/if}
    </div>
    {#if h}
        {#each customSteps[func] as step, i}
            <Card equation={equations[func]} {i}  x={step.x} {func} />
        {/each}
    {/if}
    {#if truncated[func] && $steps[func].length < collapsedAmount || truncated[func] && expanded[func]}
        <div>
            <p>{$lang.truncatedMessage}</p>
        </div>
    {/if}
    {#if $steps[func].length > collapsedAmount}
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
        gap: 1rem;
    }

    .outer > div:last-child {
        border-radius: 0 0 12px 12px;
    }

    .outer > div:first-child {
        border-radius: 12px 12px 0 0;
    }
</style>