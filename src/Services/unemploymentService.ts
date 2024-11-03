import { getLinesFromCsv } from '../serviceFunctions/getLines';

import { Platform } from 'react-native';
export async function UnemploymentServiceCalc(districtCode: string): Promise<number> {
  const filePath = "../src/assets/Unemployment.csv"; // Path to the unemployment CSV file
  
  const fetchLines = async () => {
    var lines;
    if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/Unemployment.csv");}
    else { lines = await getLinesFromCsv(require("../assets/Unemployment.csv")); }
    return lines;
  };

  

  const lines = await fetchLines();
  
  let totalUnemployment = 0;
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    var columns;
    if (Platform.OS === 'web') { columns = line.split(';');}
    else { columns = line.split(',');}

    const currentDistrictCode = columns[1]?.trim();
    const unemploymentDensity = parseFloat(columns[7]?.replace(',', '.'));

    

    if (currentDistrictCode === districtCode && !isNaN(unemploymentDensity)) {
      totalUnemployment += unemploymentDensity;
      count++;
    }
  }

  // Calculate average unemployment if there are records for the district
  const averageUnemployment = count > 0 ? totalUnemployment / count : 0;

  return averageUnemployment;
}
