// createModifiers.ts

export function createModifiers(status: string): number[] {
    let modifiers: number[] = [];

    switch (status) {
        case 'retiree':
            modifiers = [1.5,1.5,1,0.2,0.8,0.5,1,1];
            break;
        case 'student':
            modifiers = [0.5,0.5,1.5,0.5,1,0.5,2,1.5];
            break;
        case 'family':
            modifiers = [0.5,1,1,1.5,1.5,1.5,0.5,0.5];
            break;
        default:
            modifiers = [1, 1, 1, 1, 1, 1, 1]; // Default values if no match
            break;
    }

    return modifiers;
}
