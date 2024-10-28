import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export async function getLinesFromCsv(filePath: string): Promise<string[]> {
    try {
        let fileContent: string;

        if (Platform.OS === 'web') {
            // For web, use fetch to get the CSV file content
            const response = await fetch(filePath);
            fileContent = await response.text();
        } else {
            const fileUri = FileSystem.documentDirectory + filePath; 
            fileContent = await FileSystem.readAsStringAsync(fileUri);
        }

        // Split the content into lines and return as an array
        return fileContent.split('\n');
    } catch (error) {
        console.error('Error reading the CSV file:', error);
        throw error; // Re-throw the error for further handling
    }
}
