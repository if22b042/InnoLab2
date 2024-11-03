import { calculateDistance } from '../serviceFunctions/distanceCalculatorService';
import { getLinesFromCsv } from '../serviceFunctions/getLines';

import { Platform } from 'react-native';
export async function SchoolServiceCalc(lat: number, lon: number): Promise<number> {
  const RADIUS = 500; 
  const filePath = "../src/assets/School_Location.csv"; 
  
  const fetchLines = async () => {
    
    var lines;
    if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/School_Location.csv");}
    else { lines = await getLinesFromCsv(require("../assets/School_Location.csv")); }
    return lines;
  };

  const lines = await fetchLines();
  let score = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Match and extract coordinates from POINT format
    const match = line.match(/POINT\s*\(([^)]+)\)/);
    if (match) {
      const [longitude, latitude] = match[1].split(' ').map(Number);

      // Calculate distance to the school coordinates
      const distance = calculateDistance(lat, lon, latitude, longitude);
      if (distance < RADIUS) {
        score++;
      }
    }
  }
  return score;
}
