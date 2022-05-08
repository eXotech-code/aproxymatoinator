<script lang="ts">
    export let func;
    export let expanded = false;
</script>

<button
    class={ expanded ? "expanded" : "" }
    on:click={ func }
>
    <div class="icon">
        <slot></slot>
    </div>
</button>

<style>
    button {
        background: #FFE0D6;
        border-radius: 1rem;
        border: none;
        box-shadow: var(--shadow);
        align-self: flex-end;
        height: 4rem;
        width: 4rem;
        z-index: 1;
        margin: 0;
    }

    button.expanded {
        box-shadow: none;
    }

    div {
        color: #FF7547;
        height: 3rem;
        width: 3rem;
    }
</style>