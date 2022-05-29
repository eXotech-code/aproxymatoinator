<script lang="ts">
    export let id: string;
    export let value: string | number;
    export let label: string;
    export let invalid = false;
</script>

<div class={invalid ? "invalid" : ""}>
    <input class={invalid ? "invalid" : ""} {id} type="text" required bind:value>
    <label for={id}>{label}</label>
</div>

<style>
    div {
        background: #FFE0D6;
        border-bottom: 1px solid var(--border-color);
        border-radius: 4px 4px 0 0;
        position: relative;
        height: fit-content;
    }

    div:focus-within {
        border-bottom: 1px solid #FF7547;
        transition: border-bottom 0.25s ease-out;
    }

    div.invalid {
        border-bottom: 1px solid var(--invalid-color);
    }

    input {
        color: #3A445D;
        background: none;
        border: none;
        outline: none;
        padding: 1rem 0.75rem;
        width: 100%;
        height: 100%;
    }

    input:focus,
    input:valid {
        transform: translateY(18%);
        transition: transform 0.25s ease-out;
    }

    input:focus + label,
    input:valid + label {
        color: #FF7547;
        transform: translateY(-68%) scale(0.75);
        transform-origin: top left;
        transition: transform 0.25s ease-out, color 0.25s ease-out;
    }

    input.invalid + label {
        color: var(--invalid-color);
    }

    label {
        position: absolute;
        display: block;
        padding: 0.75rem;
        top: 50%;
        left: 0;
        transform: translateY(-52%);
        transform-origin: top left;
        transition: transform 0.25s ease-out, color 0.25s ease-out;
    }
</style>