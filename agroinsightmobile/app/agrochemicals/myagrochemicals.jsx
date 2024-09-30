import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useRouter, useLocalSearchParams } from "expo-router";
import FertilizersTab from "./myfertilizertab";
import PesticidesTab from "./mypesticidestab";

const MyAgrochemicalsScreen = () => {
  //const [activeTab, setActiveTab] = useState("Fertilizers");
  const router = useRouter();
  const { activeTab: initialActiveTab } = useLocalSearchParams(); // Get the activeTab from query params
  const [activeTab, setActiveTab] = useState(initialActiveTab || "Fertilizers"); // Default to Fertilizers

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          {/* Back button with Ionicons */}
          <TouchableOpacity
            onPress={() => router.push("/agrochemicals")}
            style={styles.backButton} // Use style instead of className
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Logo in the center */}
          <View style={styles.logoContainer}>
            <Image
              source={images.agroinsightlogo} // Use the correct path for the image
              resizeMode="contain"
              className="w-15 h-12"
            />
          </View>
        </View>

        <Text className="text-black text-2xl font-bold ml-2 mt-4 ml-4">
          My Agrochemicals
        </Text>

        {/* Tabs for switching between Fertilizers and Pesticides */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Fertilizers" && styles.activeTab,
            ]}
            onPress={() => handleTabSwitch("Fertilizers")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Fertilizers" && styles.activeTabText,
              ]}
            >
              Fertilizers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Pesticides" && styles.activeTab]}
            onPress={() => handleTabSwitch("Pesticides")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Pesticides" && styles.activeTabText,
              ]}
            >
              Pesticides
            </Text>
          </TouchableOpacity>
        </View>

        {/* Make content scrollable */}
        <ScrollView style={styles.contentContainer}>
          {activeTab === "Fertilizers" ? <FertilizersTab /> : <PesticidesTab />}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingLeft: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1, // Ensure it takes full height
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyAgrochemicalsScreen;
