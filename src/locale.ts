const locale = {
    lang: ["English", "Polski"],
    equation_1Label: ["Równanie różniczkowe (1)", "Differential equation (1)"],
    equation_2Label: ["Równanie różniczkowe (2)", "Differential equation (2)"],
    initialLabel: ["Wartość początkowa", "Initial value"],
    stepsLabel: ["Ilość kroków", "Number of steps"],
    stepSizeLabel: ["Wielkość kroku (h)", "Step size"],
    cardTitle: ["Krok", "Step"],
    moreButton: ["Pokaż więcej", "Show more"],
    lessButton: ["Pokaż mniej", "Show less"],
    expandButton: ["Rozwiń", "Expand"],
    collapseButton: ["Zwiń", "Collapse"],
    truncatedMessage: [
        "Dane nie mogą być wyświetlone w pełni, ponieważ poza tym przedziałem funkcja przyjmuje wartości zbliżające się do ∞.",
        "Data beyond this point cannot be computed because the value of this function approaches ∞."
    ],
    title1: ["Opis symboli", "Symbol description"],
    title2: ["Sposób działania", "How it works?"],
    info1: [
        "${yPrime} - pochodna nieznanej funkcji",
        "${yPrime} - derivative of unknown function"
    ],
    info2: [
        "${xi} - punkt, dla którego przybliżamy wynik nieznanej funkcji",
        "${xi} - point for which we compute the result of unknown function"
    ],
    info3: [
        "${yi} - aproksymacja wartości funkcji w punkcie ${xi}.",
        "${yi} - function value aproximation at point ${xi}."
    ],
    info4: [
        "${fi} - jest to wynik podstawienia do funkcji \
        po prawej stronie równiania różniczkowego \
        następujących wartości: ${xEq} oraz \
        ${yEq}",
        "${fi} - this is the result of substituting \
        the values of ${xEq} and ${yEq} \
        to the function on the right side of the differential equation"
    ],
    info5: [
        "W przypadku aktualnego równania, wzór na ${fi} \
        przyjmuje formę: \
        ${equation}.",
        "In case of current equation, the expression used \
        to calculate ${fi} is of the following form: \
        ${equation}"
    ],
    info5TwoEqs: [
        "W przypadku aktualnego układu równań, wzór \
        przyjmuje formę: \
        ${combined}.",
        "In case of current equation, the expression used \
        for both ${fi} calculation is of the following form: \
        ${combined}"
    ],
    info6: [
        "Aby uzyskać wartość nieznanej funkcji w punkcie \
        ${xEq} należy dodać do jej wartości \
        w punkcie ${xMinOneEq} wynik ${fi} \
        pomnożony razy ${h}, które jest wielkością kroku, czyli \
        różnicą w wartościach pomiędzy kolejnymi punktami.",
        "In order to obtain the value of unknown function at point \
        ${xEq} we have to add to its value at point ${xMinOneEq} the result \
        of ${fi} multiplied by ${h}, which is the step size - \
        difference in value between next steps."
    ],
    info7: [
        "Równanie dające aproksymację kolejnych wartości nieznanej funkcji \
        przyjmuje zatem postać: \
        ${yiEq}.",
        "The equation used to calculate next values of unknown function \
        takes on the following form: \
        ${yiEq}"
    ]
}

const addSecretMiau = () => {
    Object.keys(locale).forEach(k => locale[k].push("Miau"));
}

export class Locale {
    constructor(lang: number) {
        addSecretMiau();
        Object.keys(locale).forEach((k) => {
            this[k] = locale[k][lang];
        });
    }

    lang: string;
    equation_1Label: string;
    equation_2Label: string;
    initialLabel: string;
    stepsLabel: string;
    stepSizeLabel: string;
    cardTitle: string;
    moreButton: string;
    lessButton: string;
    expandButton: string;
    collapseButton: string;
    truncatedMessage: string;
    title1: string;
    title2: string;
    info1: string;
    info2: string;
    info3: string;
    info4: string;
    info5: string;
    info6: string;
    info7: string;
}

export default Locale;