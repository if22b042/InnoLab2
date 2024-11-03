import * as Location from 'expo-location';
import { Alert } from 'react-native';
import axios from 'axios';

import { getCoordinatesFromAddress } from './getAddressCoordinates';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationData {
    lat: number;
    lng: number;
    districtNumber: string;
}

// Google Maps Geocoding Service API Key (replace with your real key)
const GOOGLE_MAPS_API_KEY = "AIzaSyD8ukND-h9jUVV7nM-z_R9cYvMeY8hKiiM";

/**
 * Retrieves the user's coordinates and district number (if within Vienna).
 * @param address Optional address to use if location is outside Vienna.
 * @returns {Promise<LocationData | null>} The coordinates and district number, or null if unavailable.
 */
export async function getUserCoordinates(address?: string): Promise<LocationData | null> {
    try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return null;
        }

        // Try to get the user's current location
        const location = await Location.getCurrentPositionAsync({});
        const userCoords: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        // Check if the user is within Vienna's boundaries
        if (isInVienna(userCoords)) {
            console.log('Using user’s detected location within Vienna:', userCoords);

            // Get district information using reverse geocoding
            const districtNumber = await getDistrictNumberFromCoordinates(userCoords.latitude, userCoords.longitude);

            Alert.alert(
                'Location Detected',
                `Coordinates: (${userCoords.latitude}, ${userCoords.longitude})\nDistrict: ${districtNumber}`
            );

            return {
                lat: userCoords.latitude,
                lng: userCoords.longitude,
                districtNumber,
            };
        } else {
            // Alert with coordinates even if outside Vienna
            Alert.alert(
                'Location Detected (Outside Vienna)',
                `Coordinates: (${userCoords.latitude}, ${userCoords.longitude})`
            );

            if (address) {
                // If outside Vienna and address provided, get coordinates from address
                const addressCoords = await getCoordinatesFromAddress(address);
                console.log('Using coordinates from address input:', addressCoords);
                return addressCoords;
            } else {
                Alert.alert('Location not in Vienna and no address provided.');
                return null;
            }
        }
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

// Helper function to check if a location is within Vienna's coordinates
function isInVienna({ latitude, longitude }: Coordinates): boolean {
    // Approximate bounding box for Vienna, Austria
    const viennaBounds = {
        north: 48.323,   // Northern latitude
        south: 48.108,   // Southern latitude
        east: 16.575,    // Eastern longitude
        west: 16.183     // Western longitude
    };

    return (
        latitude <= viennaBounds.north &&
        latitude >= viennaBounds.south &&
        longitude <= viennaBounds.east &&
        longitude >= viennaBounds.west
    );
}

// Reverse geocode coordinates to get the district number based on postal code
async function getDistrictNumberFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${latitude},${longitude}`,
                key: GOOGLE_MAPS_API_KEY,
            },
        });

        if (response.data.status === "OK") {
            // Find the postal code from the address components
            const addressComponents = response.data.results[0].address_components;
            const postalCodeComponent = addressComponents.find((component: any) =>
                component.types.includes("postal_code")
            );

            if (postalCodeComponent) {
                const postalCode = postalCodeComponent.long_name;
                // Extract the district number from the postal code (Vienna's format: 1XXX for districts 1-23)
                return postalCode.slice(1, -1);
            }
        }
        return "District number not found";
    } catch (error) {
        console.error("Error fetching district number:", error);
        return "District number not found";
    }
}
