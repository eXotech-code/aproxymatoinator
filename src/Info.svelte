<script lang="ts">
    import MdInfo from "svelte-icons/md/MdInfo.svelte";
    import ButtonFAB from "./ButtonFAB.svelte";
    import { renderToString, fillTemplate } from "./common";
    import { slide } from "svelte/transition";
    import { lang } from "./stores";

    export let equations: [string, string];
    export let system: boolean;

    const genCombined = (eqs, system: boolean) => {
        // Change all mentions of y or x into y_i or x_i.
        eqs.forEach(e => e.replaceAll("y", "y_{i}").replaceAll("x", "x_{i}"));
        let combined;
        if (system) {
            combined = `f_i = \\begin{cases}
            ${eqs[0]}\\\\
            ${eqs[1]}\\
            \\end{cases}`
        } else {
            combined = `f_i = ${eqs[0]}`;
        }
        return renderToString(combined);
    }

    const changeState = (state) => {
        state = !state;
        return state;
    }
    let expanded = false;
    let generalizedEquations = Array(2).fill("");
    $: templateValues = {
        prime: renderToString("y',\\;x'"),
        xi: renderToString("x_i"),
        yi: renderToString("y_i"),
        fi: renderToString("f_i"),
        xEq: renderToString("x = x_i"),
        yEq: renderToString("y = y_i"),
        combined: genCombined(equations, system),
        xMinOneEq: renderToString("x = x_{i-1}"),
        h: renderToString("h"),
        yiEq: renderToString("y_i = y_{i-1} + f_i \\cdot h")
    }
</script>

<div class={expanded ? "outer expanded-outer" : "outer"}>
    {#if expanded}
    <div transition:slide>
        <h2>{$lang.title1}</h2>
        <p>
            {@html fillTemplate($lang.info1, templateValues)}
            <br>
            {@html fillTemplate($lang.info2, templateValues)}
            <br>
            {@html fillTemplate($lang.info3, templateValues)}
            <br>
            {@html fillTemplate($lang.info4, templateValues)}
        </p>
        <h2>{$lang.title2}</h2>
        <p>
            {@html fillTemplate($lang.info5, templateValues)}
        </p>
        <p>
            {@html fillTemplate($lang.info6, templateValues)}
        </p>
        <p>
            {@html fillTemplate($lang.info7, templateValues)}
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
        max-height: 60vh;
        overflow-y: auto;
    }

    @media screen and (max-width: 600px) {
        .outer {
            width: 92vw;
        }
    }

    ::-webkit-scrollbar {
        visibility: hidden;
    }

    .expanded-outer {
        background: #FFE0D6;
        box-shadow: var(--shadow);
    }
</style>