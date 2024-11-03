import { getLinesFromCsv } from '../serviceFunctions/getLines';

import { Platform } from 'react-native';
export async function IncomeServiceCalc(districtCode: string): Promise<number> {
  const filePath = "../src/assets/Income.csv"; // Path to the income CSV file
  
  const fetchLines = async () => {
    var lines;
    if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/Income.csv");}
    else { lines = await getLinesFromCsv(require("../assets/Income.csv")); }

    return lines;
  };

  const lines = await fetchLines();
  let totalIncome = 0;
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    var columns;
    if (Platform.OS === 'web') { columns = line.split(';');}
    else { columns = line.split(',');}

    // Extract values based on column index
    const currentDistrictCode = columns[1]?.trim();
    const incomeValue = parseFloat(columns[5]?.replace(',', '.')); // Parse and handle decimal separator

    // Check if the district code matches
    if (currentDistrictCode === districtCode && !isNaN(incomeValue)) {
      totalIncome += incomeValue;
      count++;
    }
  }

  // Calculate average income if there are records for the district
  const averageIncome = count > 0 ? totalIncome / count : 0;

  //console.log("Average Income for District", districtCode, ":", averageIncome);
  return averageIncome;
}
