<script lang="ts">
    import MdInfo from "svelte-icons/md/MdInfo.svelte";
    import ButtonFAB from "./ButtonFAB.svelte";
    import { renderToString } from "./common";
    import { slide } from "svelte/transition";

    export let equation: string;

    const changeState = (state) => {
        state = !state;
        return state;
    }
    let expanded = false;
    $: generalizedEquation = renderToString(`f_i = ${equation.replaceAll("y", "{y_i}").replaceAll("x", "{x_i}")}`);
</script>

<div class={expanded ? "outer expanded-outer" : "outer"}>
    {#if expanded}
    <div transition:slide>
        <h2>Opis symboli</h2>
        <p>
            {@html
                `
                ${renderToString("y'")} - pochodna nieznanej funkcji
                `
            }
            <br>
            {@html
                `
                ${renderToString("x_i")}
                - punkt, dla którego przybliżamy wynik nieznanej funkcji
                `
            }
            <br>
            {@html
            `
            ${renderToString("y_i")}
            - aproksymacja wartości funkcji w punkcie
            ${renderToString("x_i")}.
            `
            }
            <br>
            {@html
                `
                ${renderToString("f_i")} - jest to wynik podstawienia do funkcji
                po prawej stronie równiania różniczkowego
                następujących wartości: ${renderToString("x = x_i")} oraz
                ${renderToString("y = y_i")}
                `
            }
        </p>
        <h2>Sposób działania</h2>
        <p>
            {@html
            `
            W przypadku aktualnego równania, wzór na ${renderToString("f_i")}
            przyjmuje formę:
            ${generalizedEquation}.
            `
            }
        </p>
        <p>
            {@html 
            `
            Aby uzyskać wartość nieznanej funkcji w punkcie
            ${renderToString("x = x_i")} należy dodać do jej wartości
            w punkcie ${renderToString("x = x_{i-1}")} wynik ${renderToString("f_i")}
            pomnożony razy ${renderToString("h")}, które jest wielkością kroku, czyli
            różnicą w wartościach pomiędzy kolejnymi punktami.
            `
            }
        </p>
        <p>
            {@html 
            `
            Równianie dające aproksymację kolejnych wartości nieznanej funkcji
            przyjmuje zatem postać:
            ${renderToString("y_i = y_{i-1} + f_i \\cdot h")}.
            `
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

    .outer {
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 40vw;
        border-radius: 16px;
        box-shadow: none;
        transition-property: box-shadow, background;
        transition-duration: 0.5s;
    }

    div > div {
        padding: 1rem 1rem 4rem;
    }

    .expanded-outer {
        background: #FFE0D6;
        box-shadow: var(--shadow);
    }
</style>