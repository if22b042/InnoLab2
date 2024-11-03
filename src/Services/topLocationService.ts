import { getLinesFromCsv } from '../serviceFunctions/getLines';
import { calculateDistance } from '../serviceFunctions/distanceCalculatorService';

import { Platform } from 'react-native';
interface TopLocationRecord {
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
}

export async function TopLocationsServiceCalc(lat: number, lon: number): Promise<{ message: string; score: number }> {
  const filePath = "../src/assets/top-locations-wien.csv"; // Path to the top locations CSV file
  const RADIUS = 1000; // Radius in meters for nearby search
  
  const fetchLines = async () => {
    var lines;
    if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/top-locations-wien.csv");}
    else { lines = await getLinesFromCsv(require("../assets/top-locations-wien.csv")); }
    return lines;
  };

  const lines = await fetchLines();
  let locationsInRange: TopLocationRecord[] = [];
  let score = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const columns = line.split(';');

    const title = columns[0]?.trim();
    const category = columns[1]?.trim();
    const description = columns[2]?.trim();
    const latitude = parseFloat(columns[6]?.replace(',', '.')); // Parse and handle decimal separator
    const longitude = parseFloat(columns[7]?.replace(',', '.'));

    // Check if parsing was successful
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const distance = calculateDistance(lat, lon, latitude, longitude);
      
      // If within the specified radius, add the location to the list
      if (distance <= RADIUS) {
        locationsInRange.push({ title, category, description, latitude, longitude });
        score++;
      }
    }
  }

  // Construct message detailing nearby locations
  const message = locationsInRange.length > 0 
    ? locationsInRange.map(location => 
        `Title: ${location.title}, Category: ${location.category}, Description: ${location.description}`)
      .join('\n')
    : 'No top locations found within range.';

  console.log("Score:", score);
  console.log("Nearby Top Locations:\n", message);
  
  return { message, score };
}
