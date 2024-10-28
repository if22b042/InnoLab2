import { getLinesFromCsv } from '../ServiceFunctions/getLines';

export async function UnemploymentServiceCalc(districtCode: string): Promise<number> {
  const filePath = "../src/assets/Unemployment.csv"; // Path to the unemployment CSV file
  
  const fetchLines = async () => {
    const lines = await getLinesFromCsv(filePath);
    return lines;
  };

  const lines = await fetchLines();
  let totalUnemployment = 0;
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const columns = line.split(';');

    // Extract values based on column index
    const currentDistrictCode = columns[1]?.trim();
    const unemploymentDensity = parseFloat(columns[7]?.replace(',', '.'));

    // Check if the district code matches
    if (currentDistrictCode === districtCode && !isNaN(unemploymentDensity)) {
      totalUnemployment += unemploymentDensity;
      count++;
    }
  }

  // Calculate average unemployment if there are records for the district
  const averageUnemployment = count > 0 ? totalUnemployment / count : 0;

  return averageUnemployment;
}
