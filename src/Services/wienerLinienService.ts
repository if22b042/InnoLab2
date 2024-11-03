import { calculateDistance } from '../serviceFunctions/distanceCalculatorService';
import { getLinesFromCsv } from '../serviceFunctions/getLines';
import { Platform } from 'react-native';

import { EvaluateStations } from '../serviceFunctions/stationEvaluation'; 

interface Coordinates {
    longitude: number;
    latitude: number;
}

export async function WienerLinienServiceCalc(lat: number, lon: number) {
    const RADIUS = 500; 

    const fetchLines = async () => {
        var lines;
        if (Platform.OS === 'web') { 
            lines = await getLinesFromCsv("../src/assets/Wiener_Linien.csv");
        } else { 
            lines = await getLinesFromCsv(require("../assets/Wiener_Linien.csv")); 
        }
        return lines;
    };

    const lines = await fetchLines();

    let busCount = 0;
    let nightBusCount = 0;
    let metroCount = 0;
    let otherLineCount = 0;
    let count = 0;

    // Use Sets to track unique lines
    const countedNightBusLines = new Set();
    const countedMetroLines = new Set();
    const countedOtherLines = new Set();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) {
            continue; 
        }
        
        const columns = line.split(',');
        const stationCoordinatesMatch = line.match(/POINT \(([^)]+)\)/); // Extract coordinates
        if (!stationCoordinatesMatch) {
            continue; // Skip if coordinates are not found
        }
        
        const [longitude, latitude] = stationCoordinatesMatch[1].split(' ').map(Number); 
        const stationLines = columns[6] ? columns[6].split(',').map(line => line.trim()) : [];
        
        const distance = calculateDistance(lat, lon, latitude, longitude);
        if (distance < RADIUS && stationLines.length !== 0) {
            count++;

            // Count the types of lines uniquely within the radius
            for (const line of stationLines) {
                if (line.startsWith('N')) {
                    countedNightBusLines.add(line);
                } else if (line.startsWith('U')) {
                    countedMetroLines.add(line);
                } else {
                    countedOtherLines.add(line);
                }
            }
        }
    }

    metroCount = countedMetroLines.size;
    otherLineCount = countedOtherLines.size;
    
    const wiener_linien_score = EvaluateStations(count, nightBusCount, metroCount);

    return wiener_linien_score;
}
