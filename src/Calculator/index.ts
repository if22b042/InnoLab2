import axios from 'axios';


import { HospitalServiceCalc } from '../Services/hospitalService'; 
import { PoliceServiceCalc } from '../Services/policeService'; 
import { GreenSpaceServiceCalc } from '../Services/greenSpaceService'; 
import { SchoolServiceCalc } from '../Services/schoolService'; 
import { UnemploymentServiceCalc } from '../Services/unemploymentService'; 
import { IncomeServiceCalc } from '../Services/incomeService'; 
import { WienerLinienServiceCalc } from '../Services/wienerLinienService'; 
import { TopLocationsServiceCalc } from '../Services/topLocationService'; 


import { calculateFinalScore } from './finalScore'; 
import { createModifiers } from './createModifiers'; 
import { normalizeScores } from './scoreNormalization'; 
import { EvaluateStations } from './stationEvaluation'; 
// Define a type for the coordinates and district number
export interface LocationData {
  lat: number;
  lng: number;
  districtNumber: string;
}


export const calculateLifeQualityScore = async (coords, userCategory) => 
  {
    const latitude=coords.lat
    const longitude=coords.lng
    const district=coords.districtNumber
    console.log(district);
    var polices_score= await PoliceServiceCalc(latitude,longitude);
   
    var hospital_score= await HospitalServiceCalc(latitude,longitude);

    var greenspace_score= await GreenSpaceServiceCalc(latitude,longitude);
    var school_score= await SchoolServiceCalc(latitude, longitude);

    var district_code=district_to_code(district)//Go from district number to district code (01 -> 90100)

    var unemployment_score= await UnemploymentServiceCalc(district_code);
    var income_score= await IncomeServiceCalc(district_code);

    var wiener_linien=await WienerLinienServiceCalc(latitude,longitude);
    const { count, metroCount, nightBusCount, otherLineCount } = wiener_linien;

    const wiener_linien_score = EvaluateStations(count, nightBusCount, metroCount);

    
    var top_locations= TopLocationsServiceCalc(latitude,longitude);
    var top_location_score=(await top_locations).score;




    var scores: number[] = [hospital_score, polices_score, greenspace_score, school_score, unemployment_score, income_score, wiener_linien_score, top_location_score];
    //average scores are either from the simulation which has been completed or directly from the .csv file
    console.log(scores);
    var normal_scores= normalizeScores(scores)
    
    console.log(normal_scores);

    var modifiers=createModifiers(userCategory);

    const score= calculateFinalScore(normal_scores,modifiers);

    return (score);
    

}

function district_to_code(district: any){
  var districtCode: string;
  if (district < 10) {
    districtCode = `90${district.padStart(3, '')}00`;
  } else {
    districtCode = `9${district.padStart(3, '')}00`;
  }
  return districtCode;
  
}