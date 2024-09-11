import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";

const AgrochemicalsDashboard = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/disease-alerts`
      );
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAlertPress = (id) => {
    router.push(`/disease/${id}`);
  };

  const handleComplaintPress = () => {
    router.push("/disease/complaints"); // Navigate to the create complaint screen
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView className="h-full">
        <View className="flex-1">
          <View className="justify-between items-center flex-row ">
            <View className="flex-1 items-center pl-7">
              <Image
                source={images.agroinsightlogo}
                className="w-15 h-10"
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="mt-4 mb-2 p-4 bg-white rounded-lg shadow">
            <View className="relative">
              <Image
                source={images.sprayingpesticides}
                className="w-full h-80 rounded-lg" // Adjusted height
                resizeMode="cover"
              />
              {/* Overlay to darken the image */}
              <View className="absolute inset-0 bg-black opacity-40 rounded-lg" />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%", // Makes the View the same width as the image
                  backgroundColor: "rgba(0, 0, 0, 0.7)", // Black with 80% opacity
                  padding: 5,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Text className="text-white text-xl">
                  "Empowering farmers with safe agrochemical practices for a
                  greener, more productive Sri Lanka"
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <Text className="text-black text-4xl font-bold ml-2">
              Agrochemicals
            </Text>
            <Text className="text-black text-xl font-bold ml-2">
              About fertilizers and pesticides
            </Text>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/agrochemicals/agrochemicalnews")}
            >
              <Image source={images.fpnews} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>What's New?</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('MyAgrochemicals')}
            >
              <Image source={images.mychemicals} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>My Agrochemicals</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('FertilizerRecommendations')}
            >
              <Image source={images.frecommend} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Fertilizer Recommendations</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('PesticideRecommendations')}
            >
              <Image source={images.precommend} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Pesticide Recommendations</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: 35,
    overflow: "hidden", // Ensures that the child elements respect the parent’s border radius
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    position: "absolute", // Makes it overlay the image
    bottom: 0, // Aligns the text at the bottom of the image
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    padding: 8,
    borderBottomLeftRadius: 10, // Rounded corners matching the card
    borderBottomRightRadius: 10, // Rounded corners matching the card
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default AgrochemicalsDashboard;
