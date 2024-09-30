import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useRouter, usePathname } from "expo-router";

const MyAgrochemicalsScreen = () => {
  const [activeTab, setActiveTab] = useState("Fertilizers");
  const router = useRouter();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView>
      <View style={styles.headerContainer}>
          {/* Back button with Ionicons */}
          <TouchableOpacity
            onPress={() => router.push("/agrochemicals")} // Ensure this route exists
            style={styles.backButton} // Use style instead of className
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

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
            style={[
              styles.tab,
              activeTab === "Pesticides" && styles.activeTab,
            ]}
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

        {/* Content based on selected tab */}
        <View style={styles.contentContainer}>
          {activeTab === "Fertilizers" ? (
            <Text style={styles.contentText}>Fertilizers Content</Text>
          ) : (
            <Text style={styles.contentText}>Pesticides Content</Text>
          )}
        </View>
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
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default MyAgrochemicalsScreen;
