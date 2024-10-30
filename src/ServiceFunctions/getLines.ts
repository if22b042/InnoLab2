import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';
import Papa from 'papaparse';

export async function getLinesFromCsv(assetModuleOrFilePath: string): Promise<string[]> {
    try {
        let fileContent: string;

        if (Platform.OS === 'web') {
            const filePath=assetModuleOrFilePath;
            
            // Use fetch to load the file content on the web
            const response = await fetch(filePath);
            
            fileContent = await response.text();
 
            return fileContent.split('\n');
        } else {
            // For mobile, handle as an asset
            const asset = Asset.fromModule(assetModuleOrFilePath);
            await asset.downloadAsync();
            fileContent = await FileSystem.readAsStringAsync(asset.localUri || '');
        }

        return new Promise((resolve, reject) => {
            Papa.parse(fileContent, {
                header: false, // Set header to false to get raw rows
                skipEmptyLines: true, // Skip any empty lines
                
                complete: function (results) {
                    // Map each row (array of values) back to a raw line string if necessary
                    const lines = results.data.map((row: string[]) => row.join(','));
                    resolve(lines);
                },
                error: function (error) {
                    console.error('Error parsing CSV file:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error reading or parsing the CSV file:', error);
        throw error;
    }
}
