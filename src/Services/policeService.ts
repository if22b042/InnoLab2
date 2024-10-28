import { calculateDistance } from '../ServiceFunctions/distanceCalculatorService';

import { getLinesFromCsv } from '../ServiceFunctions/getLines';
interface coordinates{
    longitude: number;
    latitude: number;
}

export async function PoliceServiceCalc(lat:number, lon:number) {
    var RADIUS = 1000; 
    const filePath="../src/assets/Police_Locations.csv"
  
    const fetchLines = async () => {
        const lines = await getLinesFromCsv(filePath);
        return lines;
    };

    const lines = await fetchLines();

    var score=0;
    
        for (let i = 1; i < lines.length; i++) {
            var line=lines[i];
            if (!line) {
                continue; 
            }
            const Hospital_coordinates = line.match(/POINT \(([^)]+)\)/)[1].split(' ').map(Number);

            const [longitude, latitude] = Hospital_coordinates; 
            var distance= calculateDistance(lat, lon, latitude, longitude)
            if (distance<RADIUS){
                score++;
            }


            
        }

        return score;

}