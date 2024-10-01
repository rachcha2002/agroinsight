import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons"; // For back button icon
import { useRouter } from "expo-router"; // Navigation
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "../../constants"; // Assuming you have image constants

export const options = {
  headerShown: false, // Disable default header
};

const PesticideList = () => {
  const [pesticides, setPesticides] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [filteredPesticides, setFilteredPesticides] = useState([]); // Filtered results
  const router = useRouter();

  useEffect(() => {
    fetchPesticides();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Filter pesticides based on search query
      const filtered = pesticides.filter((pesticide) => {
        const regionMatch = pesticide.region
          .join(", ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const cropMatch = pesticide.suitableCrops.some(
          (crop) =>
            crops[crop.cropId]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            cropCategories[crop.cropCategoryId]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
        return regionMatch || cropMatch;
      });
      setFilteredPesticides(filtered);
    } else {
      setFilteredPesticides(pesticides);
    }
  }, [searchQuery, pesticides, crops, cropCategories]);

  const fetchPesticides = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/pesticides`
      );
      setPesticides(response.data);
      setFilteredPesticides(response.data);
      await fetchCropDetails(response.data); // Fetch crop and category names
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pesticides:", error);
      setLoading(false);
    }
  };

  const fetchCropDetails = async (pesticides) => {
    try {
      // Fetch crop categories and crops
      const categoryIds = [
        ...new Set(
          pesticides.flatMap((pesticide) =>
            pesticide.suitableCrops.map((crop) => crop.cropCategoryId)
          )
        ),
      ];
      const cropPromises = pesticides.flatMap((pesticide) =>
        pesticide.suitableCrops.map((crop) =>
          axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/cropbyid/${crop.cropId}`)
        )
      );
      const categoryPromises = categoryIds.map((id) =>
        axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/cropcategories/${id}`)
      );

      const categoryResults = await Promise.all(categoryPromises);
      const cropResults = await Promise.all(cropPromises);

      const categories = {};
      categoryResults.forEach((result) => {
        categories[result.data._id] = result.data.name;
      });
      setCropCategories(categories);

      const cropDetails = {};
      cropResults.forEach((result) => {
        cropDetails[result.data._id] = result.data.name;
      });
      setCrops(cropDetails);
    } catch (error) {
      console.error("Error fetching crop details:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPesticides();
    setRefreshing(false);
  };

  const handleToggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          {/* Back button with Ionicons */}
          <TouchableOpacity
            onPress={() => router.back()} // Navigate back to the previous screen
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Logo in the center */}
          <View style={styles.logoContainer}>
            <Image
              source={images.agroinsightlogo} // Use the correct path for the image
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="#ccc"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by region, crop, or crop category..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>

        <Text className="text-black text-2xl font-bold ml-2 mt-2 ml-4 bg-white">
          Pesticide Recommendations
        </Text>

        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredPesticides.map((pesticide) => (
            <View key={pesticide._id} style={styles.card}>
              <Image
                source={{
                  uri: pesticide.imageUrl || "https://via.placeholder.com/150",
                }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{pesticide.name}</Text>
                <Text style={styles.cardSubtitle}>
                  Regions: {pesticide.region.join(", ")}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Target Pests: {pesticide.targetPests.join(", ")}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Instructions: {pesticide.instructions}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Brands: {pesticide.brands.join(", ")}
                </Text>

                {/* Button to toggle crop details */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleToggleExpand(pesticide._id)}
                >
                  <Text style={styles.buttonText}>
                    {expanded[pesticide._id] ? "Hide Crops" : "See Crops"}
                  </Text>
                </TouchableOpacity>

                {/* Conditionally render crops if expanded */}
                {expanded[pesticide._id] && (
                  <View style={styles.cropsContainer}>
                    <Text style={styles.sectionTitle}>Suitable Crops:</Text>
                    {pesticide.suitableCrops.map((crop, index) => (
                      <View key={index} style={styles.cropItem}>
                        <Text style={styles.cropText}>
                          Category:{" "}
                          {cropCategories[crop.cropCategoryId] || "Unknown"}
                        </Text>
                        <Text style={styles.cropText}>
                          Crop Name: {crops[crop.cropId] || "Unknown"}
                        </Text>
                        <Text style={styles.cropText}>
                          Recommended Usage: {crop.recommendedUsage}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
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
    backgroundColor: "#ffffff",
  },
  backButton: {
    paddingLeft: 15, // Adjust padding as needed
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 40,
  },
  searchContainer: {
    padding: 10,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  container: {
    padding: 10,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "50%",
    height: undefined,
    aspectRatio: 1, // Make image square
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain", // Fit image inside the container
  },
  cardContent: {
    paddingHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  cropsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006400",
  },
  cropItem: {
    padding: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginVertical: 5,
  },
  cropText: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PesticideList;
