export function calculateFinalScore(normalizedValues: number[], modifiers: number[]): number {
    if (normalizedValues.length !== modifiers.length) {
        throw new Error("Arrays must be of the same length");
    }

    return normalizedValues.reduce((total, value, index) => {
        return total + value * modifiers[index];
    }, 0);
}
