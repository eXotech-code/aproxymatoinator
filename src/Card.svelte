<script lang="ts">
    import type { Step } from "./types";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";
    import MdRemove from "svelte-icons/md/MdRemove.svelte";
    import { renderToString, fillTemplate, genTemplateEquation } from "./common";
    import { lang } from "./stores";
    import Button from "./Button.svelte";
    import { slide } from "svelte/transition";

    export let i: number;
    export let equations: string[];

    let expanded = false;
</script>

<div class="card" transition:slide>
    <div class="information">
        <p class="card-title">{`${$lang.cardTitle}: ${i}`}</p>
        <div class={ expanded ? "expanded" : "" }>
            {#each equations as eq}
                <p>{@html eq}</p>
            {/each}
        </div>
    </div>
    <div class="interaction">
        {#if i}
            <Button
                label={ expanded ? $lang.lessButton : $lang.moreButton }
                func={ () => expanded = !expanded }
                {expanded}
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
    
    .card:first-child {
        border-radius: 12px 12px 0 0;
    }

    .card:last-child {
        border-radius: 0 0 12px 12px
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