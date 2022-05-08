<script lang="ts">
    import MdInfo from "svelte-icons/md/MdInfo.svelte";
    import ButtonFAB from "./ButtonFAB.svelte";
    import { slide } from "svelte/transition";
    import { renderToString } from "./common";

    const changeState = (state) => {
        state = !state;
        return state;
    }
    let expanded = false;
</script>

<div class={expanded ? "expanded-outer" : ""}>
    {#if expanded}
    <div transition:slide class={expanded ? "expanded" : "info"}>
        <h2>Przykładowe pochodne</h2>
        <p>
            {@html
                `
                ${renderToString("y' = y(1 - y)")}
                to pochodna funkcji
                ${renderToString("y(x) = \\frac{-\\frac{10}{9}e^x}{-\\frac{10}{9}e^x+1}")}.
                `
            }
            <br>
            {@html
                `Najlepszą aproksymację tej funkcji można uzyskać dla ${renderToString("h = 0.01")}.`
            }
        </p>
        <p>
            {@html
                `
                ${renderToString("y' = y^2 + 1")}
                to pochodna funkcji
                ${renderToString("y(x) = \\tg{x}")}.
                `
            }
            <br>
            {@html
            `Najlepszą aproksymację tej funkcji można uzyskać dla ${renderToString("h = 0.001")}.`
            }
        </p>
    </div>
    {/if}
    <ButtonFAB {expanded} func={() => expanded = changeState(expanded)}><MdInfo /></ButtonFAB>
</div>

<style>
    h2 {
        color: #FF7547;
    }

    div {
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 40vw;
        border-radius: 16px;
        box-shadow: none;
    }

    div > div {
        padding: 1rem 1rem 4rem;
    }

    .info {
        background: transparent;
    }

    .expanded {
        background: #FFE0D6;
    }

    .expanded-outer {
        box-shadow: var(--shadow);
    }
</style>