const locale = {
    lang: ["English", "Polski"],
    equationLabel: ["Równanie różniczkowe", "Differential equation"],
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
    equationLabel: string;
    initialLabel: string;
    stepsLabel: string;
    stepSizeLabel: string;
    cardTitle: string;
    moreButton: string;
    lessButton: string;
    expandButton: string;
    collapseButton: string;
    truncatedMessage: string;
}

export default Locale;