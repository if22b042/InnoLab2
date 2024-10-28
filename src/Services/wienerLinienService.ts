import { calculateDistance } from '../ServiceFunctions/distanceCalculatorService';
import { getLinesFromCsv } from '../ServiceFunctions/getLines';

interface Coordinates {
    longitude: number;
    latitude: number;
}

export async function   WienerLinienServiceCalc(lat: number, lon: number) {
    const RADIUS = 500; 
    const filePath = "../src/assets/Wiener_Linien.csv";
  
    const fetchLines = async () => {
        const lines = await getLinesFromCsv(filePath);
        return lines;
    };

    const lines = await fetchLines();

    let busCount = 0;
    let nightBusCount = 0;
    let metroCount = 0;
    let otherLineCount = 0;
    let count = 0;

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
        if (distance < RADIUS&&stationLines.length!=0) {
            count++;


            // Count the types of lines
            for (const line of stationLines) {
                if (line.startsWith('N')) {
                    nightBusCount++; // Count night buses
                } else if (line.startsWith('U')) {
                    metroCount++; // Count metros
                } else {
                    otherLineCount++; // Count other lines
                }
            }
        }
    }


    // Create a return message with the results

    
    return {count,  metroCount, nightBusCount, otherLineCount };
}
