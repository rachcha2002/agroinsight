//import { View, Text } from "react-native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";

const header = () => {
  return (
    <View style={styles.headerContainer}>
      <View>
        {/* Back button with Ionicons */}
        <TouchableOpacity
          onPress={() => router.back()} // Use router.back() for back functionality
          style={styles.backButton} // Apply styles correctly
          activeOpacity={0.7} // Add an activeOpacity to give visual feedback on press
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Logo in the center */}
      <View style={styles.logoContainer}>
        <Image
          source={images.agroinsightlogo} // Use the correct path for the image
          //style={styles.logo}
          resizeMode="contain"
          className="w-15 h-12"
        />
      </View>
    </View>
  );
};

export default header;

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingLeft: 15, // Adjust padding as needed
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
};
