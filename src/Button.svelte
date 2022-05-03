<script lang="ts">
    export let label: string;
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
    <p>{ label }</p>
</button>

<style>
    button {
        color: #00B8F5;
        background: #f3e5e0;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        padding: 0.5rem 1.5rem 0.5rem 1rem;
        gap: 0.5rem;
        height: 2.5rem;
        border: none;
        border-radius: 100px;
    }

    button:hover {
        background: #def7ff;
        transition: background 0.25s ease-in-out;
    }

    button:active {
        filter: brightness(88%);
    }

    button.expanded {
        color: #E34F9B;
    }

    .icon {
        width: 1rem;
        height: 1rem;
    }
</style>