import axios from 'axios';

import { HospitalServiceCalc } from '../Services/hospitalService'; 
import { PoliceServiceCalc } from '../Services/policeService'; 
import { GreenSpaceServiceCalc } from '../Services/greenSpaceService'; 
import { SchoolServiceCalc } from '../Services/schoolService'; 
import { UnemploymentServiceCalc } from '../Services/unemploymentService'; 
import { IncomeServiceCalc } from '../Services/incomeService'; 
import { WienerLinienServiceCalc } from '../Services/wienerLinienService'; 
import { TopLocationsServiceCalc } from '../Services/topLocationService'; 
import { EvaluateStations } from '../Calculator/stationEvaluation'; 

// Define a type for the coordinates and district number
export interface LocationData {
  lat: number;
  lng: number;
  districtNumber: string;
}

// Function to generate random coordinates within Vienna's bounding box
const generateRandomCoordinatesInVienna = () => {
  const minLat = 48.1415;  // Minimum latitude for Vienna
  const maxLat = 48.3169;  // Maximum latitude for Vienna
  const minLng = 16.1500;  // Minimum longitude for Vienna
  const maxLng = 16.5826;  // Maximum longitude for Vienna

  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;

  return { lat, lng };
};

// Function to calculate the average life quality score
export const calculateAverageLifeQualityScores = async (iterations: number) => {
  let hospital_score = 0;
  let police_score = 0;
  let green_score = 0;
  let school_score = 0;
  let wiener_linien_score = 0;

  for (let i = 0; i < iterations; i++) {
    
    const coords = generateRandomCoordinatesInVienna();
    const districtNumber = await getDistrictNumber(coords.lat, coords.lng); // Implement this function to get the district number based on coordinates

    // Create location data object
    const locationData: LocationData = { lat: coords.lat, lng: coords.lng, districtNumber };

    const score = await calculateLifeQualityScore(locationData);
    
    if(score[3]==0||score[1]==0||score[2]<3||score[4]==0){//if these conditions aren´t meet the location is probably uninhabitated
        i--;
        continue;
    }
    else{
    hospital_score=hospital_score+score[0]
    police_score=police_score+score[1]
    green_score=green_score+score[2]
    school_score=school_score+score[3]
    wiener_linien_score=wiener_linien_score+score[4]
    console.log(i); 
}
  }
  const average_hospital=hospital_score/iterations;
  const average_police=police_score/iterations;
  const average_green=green_score/iterations;
  const average_school=school_score/iterations;
  const average_wiener_linien=wiener_linien_score/iterations;
  const averages: number[] = [average_hospital,average_police,average_green,average_school,average_wiener_linien]
  console.log(averages);
  return averages
}

// Assuming calculateLifeQualityScore is already defined as in your previous code
export const calculateLifeQualityScore = async (coords: LocationData) => {
  const latitude = coords.lat;
  const longitude = coords.lng;
  const district = coords.districtNumber;

  const hospital_score = await HospitalServiceCalc(latitude, longitude);
  const polices_score = await PoliceServiceCalc(latitude, longitude);
  const greenspace_score = await GreenSpaceServiceCalc(latitude, longitude);
  const school_score = await SchoolServiceCalc(latitude, longitude);

  var wiener_linien=await WienerLinienServiceCalc(latitude,longitude);
  const { count, metroCount, nightBusCount, otherLineCount } = wiener_linien;

  const wiener_linien_score = EvaluateStations(count, nightBusCount, metroCount);




  

  const scores: number[] = [hospital_score, polices_score, greenspace_score, school_score, wiener_linien_score];

  return scores;
}

// Function to convert district number to district code
function district_to_code(district: any) {
  let districtCode: string;
  if (district < 10) {
    districtCode = `90${district.padStart(3, '')}00`;
  } else {
    districtCode = `9${district.padStart(3, '')}00`;
  }
  return districtCode;
}

const getDistrictNumber = async (lat: number, lng: number) => {
  // Implementation to determine district number based on coordinates
  // This could involve a lookup in a database or an API call
  return '01'; // Example: returning district 01
}
