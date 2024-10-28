import axios from 'axios';


import { HospitalServiceCalc } from '../Services/hospitalService'; 
import { PoliceServiceCalc } from '../Services/policeService'; 
import { GreenSpaceServiceCalc } from '../Services/greenSpaceService'; 
import { SchoolServiceCalc } from '../Services/schoolService'; 
import { UnemploymentServiceCalc } from '../Services/unemploymentService'; 
import { IncomeServiceCalc } from '../Services/incomeService'; 

// Define a type for the coordinates and district number
export interface LocationData {
  lat: number;
  lng: number;
  districtNumber: string;
}

// Google Maps Geocoding Service
const GOOGLE_MAPS_API_KEY = "AIzaSyD8ukND-h9jUVV7nM-z_R9cYvMeY8hKiiM"; // Replace with your real API key

/**
 * @param address - The address to geocode
 * @returns {Promise<LocationData>} - Promise that resolves to coordinates and district number
 */
export const getCoordinatesFromAddress = async (address: string): Promise<LocationData> => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;

      // Find the postal code from the address components
      const addressComponents = response.data.results[0].address_components;
      const postalCodeComponent = addressComponents.find((component: any) =>
        component.types.includes("postal_code")
      );

      let districtNumber = "District number not found";
      if (postalCodeComponent) {
        const postalCode = postalCodeComponent.long_name;
        // Adjust the district number by removing the first and last characters
        districtNumber = postalCode.slice(1, -1);
      }



      // Return the latitude, longitude, and district number
      return { lat, lng, districtNumber };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
};