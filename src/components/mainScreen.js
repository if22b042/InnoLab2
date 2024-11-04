import React, { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { calculateLifeQualityScore } from '../index/index'; // Import the service
import { getCoordinatesFromAddress } from '../getCoordinates/getAddressCoordinates';
import { getUserCoordinates } from '../getCoordinates/getUserCoordinates'; // Import getUserCoordinates function

const HomeScreen = () => {
  const [userCategory, setUserCategory] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [useDetectedLocation, setUseDetectedLocation] = useState(false); // New state to track if detected location is used
  const navigation = useNavigation(); 

  const handleDetectLocation = async () => {
    try {
      const detectedCoords = await getUserCoordinates(); // Get user's coordinates
      if (detectedCoords) {
        setCoordinates(detectedCoords); // Set coordinates if detected
        setUseDetectedLocation(true); // Mark that we’re using detected coordinates
        Alert.alert("Location Detected", "Using your current location within Vienna.");
      } else {
        Alert.alert("Location Error", "Could not detect a valid location within Vienna.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while detecting location.");
    }
  };

  const handleSubmit = async () => {
    if (!location && !useDetectedLocation) {
      Alert.alert("Please enter a location or detect your current location.");
      return;
    }

    try {
      let coords = coordinates;
      
      // If not using detected location, get coordinates from address
      if (!useDetectedLocation) {
        coords = await getCoordinatesFromAddress(location);
        setCoordinates(coords);
      }

      // Calculate the life quality score and normalized scores
      const { score, normalizedScores } = await calculateLifeQualityScore(coords, userCategory);
      console.log("Final Score: ", score);
      console.log("Normalized Scores: ", normalizedScores);

      // Navigate to Results screen with both final score and normalized scores
      navigation.navigate('Results', {
        userCategory,
        location,
        coordinates: coords,
        score,
        normalizedScores, // Pass the normalized scores
      });
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching the coordinates.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vienna Life Quality</Text>
      </View>

      {/* User Category Selection */}
      <View style={styles.categorySection}>
        <Text style={styles.label}>Select User Category:</Text>
        <Picker
          selectedValue={userCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setUserCategory(itemValue)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Parent with Small Children" value="family" />
          <Picker.Item label="Retiree" value="retiree" />
        </Picker>
      </View>

      {/* Location Section */}
      <View style={styles.locationSection}>
        <TouchableOpacity style={styles.button} onPress={handleDetectLocation}>
          <Text style={styles.buttonText}>Detect Current Location</Text>
        </TouchableOpacity>
        <Text style={styles.subText}>Or Enter Address Manually:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            setUseDetectedLocation(false); // Reset to manual address input
          }}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Check Life Quality</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Future Links: Help | Contact</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e0f7fa",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796b",
    textAlign: "center",
  },
  categorySection: {
    marginVertical: 20,
    width: "100%",
  },
  label: {
    fontSize: 18,
    color: "#004d40",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#004d40",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  locationSection: {
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#004d40",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
  },
  subText: {
    marginVertical: 10,
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#00796b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitSection: {
    width: "100%",
    marginVertical: 20,
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
});

export default HomeScreen;
