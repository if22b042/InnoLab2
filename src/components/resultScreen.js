import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ResultsScreen = ({ route }) => {
  const { userCategory, location, coordinates, score, normalizedScores } = route.params;

  // Explanation of scores
  const scoreExplanation = `
  The Life Quality Score is calculated based on various factors that contribute to your living conditions. Here’s a breakdown of the components:

  - **Healthcare Access**: Assessed through the availability and proximity of hospitals.
  - **Safety**: Evaluated based on the presence of police stations in your vicinity.
  - **Green Spaces**: Measures the accessibility of parks and recreational areas.
  - **Educational Institutions**: Considers the proximity of schools and educational facilities.
  - **Income Conditions**: Includes income rate in your district
  - **Unemployment Conditions**: Evaluated based on the unemployment density in your district
  - **Public Transport**: Evaluates the availability of public transport options, including buses and metro lines.
  - **Top Locations**: Considers the accessibility of popular destinations and essential services.

  Each component is normalized to ensure fairness, and your final score reflects a holistic view of your living environment.
  `;

  // Function to determine score color
  const getScoreColor = (score) => {
    if (score < 1) return '#ff7043'; // Red for bad scores
    if (score >= 1 && score < 1.5) return '#ffcc00'; // Yellow for moderate scores
    return '#4caf50'; // Green for good scores
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

      <View style={styles.explanationContainer}>
        <Text style={styles.explanationText}>{scoreExplanation}</Text>

        <View style={styles.scoresContainer}>
          <Text style={styles.scoresTitle}>Normalized Scores:</Text>
          {normalizedScores.map((normalizedScore, index) => {
            const categoryName = [
              'Healthcare Access',
              'Safety',
              'Green Spaces',
              'Education',
              'Income ',
              'Unemployment', 
              'Public Transport',
              'Top Locations',
            ][index];

            return (
              <Text key={index} style={[styles.normalizedScore, { color: getScoreColor(normalizedScore) }]}>
                {categoryName}: {normalizedScore.toFixed(2)}
              </Text>
            );
          })}
        </View>
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
  explanationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  scoresContainer: {
    marginTop: 15,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  normalizedScore: {
    fontSize: 14,
    marginVertical: 5,
  },
});

export default ResultsScreen;
  