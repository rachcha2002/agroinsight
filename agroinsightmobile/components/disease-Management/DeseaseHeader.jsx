import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { images, icons } from '../../constants';
import { router } from 'expo-router';
import Ionicons from "react-native-vector-icons/Ionicons";

const DeseaseHeader = () => {
  const handlePress = () => {
    router.push('/disease/createcomplaint'); // Navigate to the create complaint screen
  };

  return (
    <View style={styles.headerContainer}>
      {/* Back button with Ionicons */}
      <TouchableOpacity
        onPress={() => router.push('/disease')} // Use router.back() for back functionality
        style={styles.backButton}
        activeOpacity={0.7} // Add an activeOpacity to give visual feedback on press
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Logo in the center */}
      <View style={styles.logoContainer}>
        <Image
          source={images.agroinsightlogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Plus button on the right */}
      <TouchableOpacity
        onPress={handlePress}
        style={styles.plusButton}
        activeOpacity={0.7}
      >
        <Image
          source={icons.plusgreen}
          style={styles.plusIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default DeseaseHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 80, // Increased the width
    height: 50, // Increased the height
  },
  plusButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  plusIcon: {
    width: 36,
    height: 40,
  },
});
