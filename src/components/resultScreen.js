import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultsScreen = ({ route }) => {
  const { userCategory, location, coordinates, score } = route.params;
  
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
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
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
});

export default ResultsScreen;
