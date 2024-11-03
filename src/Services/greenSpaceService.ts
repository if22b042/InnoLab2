import { calculateDistance } from '../serviceFunctions/distanceCalculatorService';
import { getLinesFromCsv } from '../serviceFunctions/getLines';

import { Platform } from 'react-native';
interface Coordinates {
  longitude: number;
  latitude: number;
}

export async function GreenSpaceServiceCalc(lat: number, lon: number): Promise<number> {
  const RADIUS = 1000; // Radius in meters for nearby search
  const filePath = "../src/assets/GreenSpace.csv"; // Path to the greenspace CSV file
  
  const fetchLines = async () => {
    var lines;
    if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/GreenSpace.csv");}
    else { lines = await getLinesFromCsv(require("../assets/GreenSpace.csv")); }
    return lines;
  };

  const lines = await fetchLines();
  let score = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || typeof line !== 'string') continue; 

    // Match coordinates within POLYGON or MULTIPOLYGON
    const match = line.match(/POLYGON\s*\(\(([^)]+)\)\)|MULTIPOLYGON\s*\(\(\(([^)]+)\)\)/);
    if (match) {
      // Select the first capturing group that has data
      const coordinatesString = match[1] || match[2];

      // Split and parse each coordinate pair
      const coordinatesArray = coordinatesString.split(',').map(coord => {
        const [longitude, latitude] = coord.trim().split(' ').map(Number);
        return { longitude, latitude };
      });

      // Find the closest point in the polygon to the target (lat, lon)
      let minDistance = Infinity;
      for (const { longitude, latitude } of coordinatesArray) {
        const distance = calculateDistance(lat, lon, latitude, longitude);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }

      // If the closest point in the polygon is within the radius, increment the score
      if (minDistance < RADIUS) {
        score++;
      }
    }
  }

  return score;
}
