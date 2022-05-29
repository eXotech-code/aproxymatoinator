<script lang="ts">
    import MdExpandLess from "svelte-icons/md/MdExpandLess.svelte";
    import MdExpandMore from "svelte-icons/md/MdExpandMore.svelte";

    export let label: string;
    export let options: string[];
    export let selected: string = options[0];

    let expanded = false;
</script>

<div class="container">
    <p>{label}</p>
    <div class="dropdown">
        <div class="interaction" on:click={() => expanded = !expanded}>
            <p>{selected}</p>
            <div class="icon">
                {#if expanded}
                    <MdExpandLess />
                {:else}
                    <MdExpandMore />
                {/if}
            </div>
        </div>
        {#if expanded}
            <div class="list">
                {#each options as opt}
                    <div on:click={() => { selected = opt; expanded = !expanded }}>{opt}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-left: 2rem;
    }

    .container:first-child {
        margin-left: 0;
    }

    p {
       margin: 0;
    }

    .dropdown {
        position: relative;
    }

    .interaction {
        display: flex;
        width: 10rem;
        gap: 2rem;
        padding: 1rem;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
    }

    .list {
        position: absolute;
        z-index: 1;
        display: flex;
        flex-direction: column;
        width: fit-content;
        box-shadow: var(--elevation-shadow);
        border-radius: 4px;
        padding: 0.5rem 0;
        background: #FFE0D6;
    }

    .list > div {
        cursor: pointer;
        width: 10rem;
        padding: 0.5rem 1rem;
        background: #FFE0D6;
    }

    .list > div:hover {
        filter: brightness(90%);
    }

    .icon {
        width: 1rem;
        height: 1rem;
    }
</style>