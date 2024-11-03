import { calculateDistance } from '../serviceFunctions/distanceCalculatorService';

import { Platform } from 'react-native';
import { getLinesFromCsv } from '../serviceFunctions/getLines';
interface coordinates{
    longitude: number;
    latitude: number;
}

export async function PoliceServiceCalc(lat:number, lon:number) {
    var RADIUS = 1000; 
  
    const fetchLines = async () => {
        var lines;
        if (Platform.OS === 'web') { lines = await getLinesFromCsv("../src/assets/Police_Locations.csv");}
        else { lines = await getLinesFromCsv(require("../assets/Police_Locations.csv")); }
       
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