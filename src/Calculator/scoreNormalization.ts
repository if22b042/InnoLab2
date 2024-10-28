// Define a function to normalize scores
export const normalizeScores = (scores: number[], averageScores: number[]): number[] => {
    const normalizedScores = scores.map((score, index) => normalize(score, averageScores[index]));
    return normalizedScores;
};

const normalize = (score: number, average: number): number => {
    if (average === 0) return 0; // Avoid division by zero
    const normalizedValue = (score / average);
    return Math.max(0, Math.min(1, normalizedValue)); // Clamp between 0 and 1
};
