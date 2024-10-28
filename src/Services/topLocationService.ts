import { getLinesFromCsv } from '../ServiceFunctions/getLines';
import { calculateDistance } from '../ServiceFunctions/distanceCalculatorService';

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
    const lines = await getLinesFromCsv(filePath);
    return lines;
  };

  const lines = await fetchLines();
  let locationsInRange: TopLocationRecord[] = [];
  let score = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Split the CSV line into columns by semicolon delimiter
    const columns = line.split(';');

    // Extract and parse the values based on column index
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
