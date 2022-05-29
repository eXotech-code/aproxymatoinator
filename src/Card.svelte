<script lang="ts">
    import type { Step } from "./types";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";
    import MdRemove from "svelte-icons/md/MdRemove.svelte";
    import { renderToString, fillTemplate, genTemplateEquation } from "./common";
    import { lang } from "./stores";
    import Button from "./Button.svelte";
    import { slide } from "svelte/transition";

    export let i: number;
    export let x: number;
    export let equation: string;
    export let system: boolean;
    export let func: number;
    export let steps: Step[];
    export let method: string;

    const functionSymbol = (system: boolean, func: number, i: number) => {
        let symbol: string;
        if (system) {
            symbol =  func ? "y_{${i}}" : "x_{${i}}";
        } else {
            symbol = "x_{${i}}"
        }

        return fillTemplate(symbol, { i: i });
    }

    const euler = (i: number, expanded: boolean, steps: Step[], func: number, system: boolean, fTruncated: number[]) => {
        const eqF = ["f_{${i}} = f(${x}, ${y}) = ${eqSubs} = ${f}", "f_{${i}} = ${f}"];
        const eqY = ["${i} = ${yPrev} + ${h} \\cdot ${fPrev} = ${y}", "${i} = ${y}"];
        let resF, resY;
        try {
            if (expanded) {
                resY = fillTemplate(
                    eqY[0],
                    { 
                        i: functionSymbol(system, func, i),
                        yPrev: steps[i-1].y,
                        h: steps[i].x / i,
                        fPrev: steps[i-1].f,
                        y: steps[i].y
                    }
                );
                // Equation with substituted variable names.
                resF = fillTemplate(
                    eqF[0],
                    {
                        i: i,
                        x: steps[i].x,
                        y: steps[i].y,
                        eqSubs: genTemplateEquation(equation, steps, i),
                        f: fTruncated
                    }
                );
            } else {
                resY = fillTemplate(
                    eqY[1],
                    {
                        i: functionSymbol(system, func, i),
                        y: steps[i].y
                    }
                )
                resF = fillTemplate(
                    eqF[1],
                    {
                        i: i,
                        f: fTruncated
                    }
                )
            }
        } catch (err) {
            return [];
        }

        return [renderToString(resY), renderToString(resF)];
    }

    const fillRunge = (i: number, eqK: string, h: number) => {
        let x;
        let y;
        let ks = [];
        for (let j = 0; j < 4; j++) {
            if (!j) {
                x = steps[i].x;
                y = steps[i].y;
            } else if (j===3) {
                x = steps[i-1].x + h;
                y = steps[i-1].y + steps[i].f[j-1];
            } else {
                x = steps[i-1].x + h/2;
                y = steps[i-1].y + steps[i].f[j-1]/2;
            }
            x = parseFloat(x.toFixed(3));
            y = parseFloat(y.toFixed(3));
            ks.push(
                fillTemplate(
                    eqK,
                    {
                        i: j+1,
                        x: x,
                        y: y,
                        eqSubs: genTemplateEquation(equation, steps, i, { x: x }),
                        f: parseFloat(steps[i].f[j].toFixed(3))
                    }
                )
            );
        }

        return ks;
    }

    const runge = (i: number, expanded: boolean, steps: Step[], func: number, system: boolean, fTruncated: number[]) => {
        const eqK = ["k_{${i}} = f(${x}, ${y}) = ${eqSubs} = ${f}", "k_{${i}} = ${f}"];
        const eqY = ["${i} = ${yPrev} + 1/6 \\cdot ${h} \\cdot ${fq} = ${y}", "${i} = ${y}"];
        let h = steps[i].x / i;
        let ks;
        let y;
        let iSym = functionSymbol(system, func, i);
        try {
            if (expanded) {
                ks = fillRunge(i, eqK[0], h);
                y = fillTemplate(eqY[0], { i: iSym, yPrev: steps[i-1].y, h: h, fq: "(k_1 + 2k_2 + 2k_3 + k_4)", y: steps[i].y });
            } else {
                ks = fillRunge(i, eqK[1], h);
                y = fillTemplate(eqY[1], { i: iSym, y: steps[i].y });
            }
        } catch (err) {
            console.log(err);
            return [];
        }

        let res = [renderToString(y)];
        ks.forEach(k => res.push(renderToString(k)));

        return res;
    }

    // Generates equations for a specified step and saves them into array for later use.
    // If an equation is already in list, it returns it.
    const genEquations = (i: number, expanded: boolean, steps: Step[], func: number, system: boolean, method: string) => {
        let fTruncated = [];
        steps[i].f.forEach(fn => fTruncated.push(parseFloat(fn.toFixed(3))));
        
        if (method === "Euler") {
            return euler(i, expanded, steps, func, system, fTruncated);
        } else {
            return runge(i, expanded, steps, func, system, fTruncated);
        }
    }

    let expanded = false;
    $: currentEquations = genEquations(i, expanded, steps, func, system, method);
</script>

<div class="card" transition:slide>
    <div class="information">
        <p class="card-title">{`${$lang.cardTitle}: ${i}`}</p>
        <div class={ expanded ? "expanded" : "" }>
            <p>{@html renderToString(`t_{${i}} = ${x}`)}</p>
            {#each currentEquations as eq}
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