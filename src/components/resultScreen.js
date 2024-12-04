import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

const ResultsScreen = ({ route }) => {
  const { userCategory, location, coordinates, score, normalizedScores, results } = route.params;
  const [hoveredScore, setHoveredScore] = useState(null); // State to store hovered result

  // Explanation for each category
  const categoryExplanations = [
    "Healthcare Access: Assessed through the availability and proximity of hospitals in a range of 2000m from your location.",
    "Safety: Evaluated based on the presence of police stations in the vicinity of 1000m.",
    "Green Spaces: Measures the accessibility of parks and recreational areas within 1000m.",
    "Educational Institutions: Considers the proximity of schools and educational facilities within 500m.",
    "Income Conditions: Includes income rate in your district.",
    "Unemployment Conditions: Evaluated based on the unemployment density in your district.",
    "Public Transport: Evaluates the proximity of public transport stations such as buses and metro lines within 500m.",
    "Top Locations: Considers the vicinity of your location to prominent Tourist Places in Vienna, within 1000m."
  ];

  // Function to interpolate between colors based on normalized score
  const getColorFromScore = (score) => {
    // Define a simple linear color scale from red to green
    const r = Math.max(255 - score * 122, 0); // Red decreases as score increases
    const g = Math.min(score * 122, 255); // Green increases as score increases
    const b = 0; // Keep blue at zero for simplicity
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleHover = (index) => {
    if (Platform.OS === 'web') {
      setHoveredScore(index); 
    } else {
      setHoveredScore(index); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Life Quality Score</Text>
      <Text style={styles.score}>{score}</Text>

      <View style={styles.bottomContainer}>
        <Text style={styles.resultText}>User Category: {userCategory}</Text>
        <Text style={styles.resultText}>Location: {location}</Text>
        <Text style={styles.resultText}>
          Coordinates: {coordinates.lat}, {coordinates.lng}
        </Text>
        <Text style={styles.resultText}>District: {coordinates.districtNumber}</Text>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.scoresTitle}>Results (Before Normalization):</Text>
        {results.map((rawScore, index) => {
          const categoryName = [
            'Healthcare Access',
            'Safety',
            'Green Spaces',
            'Education',
            'Income',
            'Unemployment',
            'Public Transport',
            'Top Locations',
          ][index];

          return (
            <TouchableOpacity
              key={index}
              style={styles.resultItem}
              onMouseEnter={() => handleHover(index)} // Hover for web
              onPress={() => handleHover(index)} // Press for mobile
            >
              <Text
                style={[
                  styles.resultText,
                  { color: getColorFromScore(normalizedScores[index]) },
                ]}
              >
                {categoryName}: {rawScore.toFixed(2)}
              </Text>

              {hoveredScore === index && (
                <View style={styles.scoreDetails}>
                  <Text style={styles.explanationText}>
                    {categoryExplanations[index]}
                  </Text>
                  <Text style={styles.explanationText}>
                    Normalized Score: {normalizedScores[index].toFixed(2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 10,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff7043',
    textAlign: 'center',
    marginBottom: 30,
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    width: '90%',
    maxWidth: 600, 
    height: 500, 
    overflowY: 'auto', 
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  resultItem: {
    marginBottom: 10,
  },
  scoreDetails: {
    paddingLeft: 10,
    marginTop: 5,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
});

export default ResultsScreen;
