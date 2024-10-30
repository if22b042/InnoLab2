// Define a function to normalize scores
export const normalizeScores = (scores: number[]): number[] => {
    
    var average_scores: number[] =[1.92, 2.06, 25.36, 4.37,89.91, 24.992,23.26,1]
    var standard_deviations: number[]= [3, 5, 30, 5, 80, 18.000, 45, 5]
    const normalizedScores = scores.map((score, index) => normalize(score, average_scores[index], standard_deviations[index]));
    return normalizedScores;
};

const normalize = (score: number, average: number, deviation): number => {
    if (deviation === 0) return 0; // Avoid division by zero
    const normalizedValue = ((score-average) / deviation);
    return (Math.min((normalizedValue+1),2)); 
};
