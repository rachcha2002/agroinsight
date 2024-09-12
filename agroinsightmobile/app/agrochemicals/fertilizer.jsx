import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router"; // Router for navigation
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons"; // Icon for the back button
import { images } from "../../constants"; // Assuming images are stored in a constants folder
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import Ionicons from "react-native-vector-icons/Ionicons";

export const options = {
  headerShown: false, // Disables the default header
};

const FertilizerList = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [filteredFertilizers, setFilteredFertilizers] = useState([]); // Filtered results
  const router = useRouter();

  useEffect(() => {
    fetchFertilizers();
  }, []);

  useEffect(() => {
    // Filter fertilizers based on search query, including regions, crops, and crop categories
    if (searchQuery) {
      const filtered = fertilizers.filter((fertilizer) => {
        const regionMatch = fertilizer.region
          .join(", ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const cropMatch = fertilizer.suitableCrops.some(
          (crop) =>
            crops[crop.cropId]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            cropCategories[crop.cropCategoryId]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) // Matching crop categories
        );
        return regionMatch || cropMatch;
      });
      setFilteredFertilizers(filtered);
    } else {
      setFilteredFertilizers(fertilizers);
    }
  }, [searchQuery, fertilizers, crops, cropCategories]);

  const fetchFertilizers = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.167:5000/api/f&p/fertilizers"
      );
      setFertilizers(response.data);
      setFilteredFertilizers(response.data);
      await fetchCropDetails(response.data); // Fetch crop and category names
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fertilizers:", error);
      setLoading(false);
    }
  };

  const fetchCropDetails = async (fertilizers) => {
    try {
      // Fetch crop categories and crops
      const categoryIds = [
        ...new Set(
          fertilizers.flatMap((fertilizer) =>
            fertilizer.suitableCrops.map((crop) => crop.cropCategoryId)
          )
        ),
      ];
      const cropPromises = fertilizers.flatMap((fertilizer) =>
        fertilizer.suitableCrops.map((crop) =>
          axios.get(`http://192.168.1.167:5000/api/f&p/cropbyid/${crop.cropId}`)
        )
      );
      const categoryPromises = categoryIds.map((id) =>
        axios.get(`http://192.168.1.167:5000/api/f&p/cropcategories/${id}`)
      );

      // Resolve all promises
      const categoryResults = await Promise.all(categoryPromises);
      const cropResults = await Promise.all(cropPromises);

      // Process crop categories and crops into a dictionary
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
    await fetchFertilizers();
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

        <Text className="text-black text-2xl font-bold ml-2 mt-2 ml-4 bg-white">
          Fertilizer Recommendations
        </Text>

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
              placeholderTextColor="#ccc" // Optional: Change the placeholder color
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredFertilizers.map((fertilizer) => (
            <View key={fertilizer._id} style={styles.card}>
              <Image
                source={{
                  uri: fertilizer.imageUrl || "https://via.placeholder.com/150",
                }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{fertilizer.name}</Text>
                <Text style={styles.cardSubtitle}>Type: {fertilizer.type}</Text>
                <Text style={styles.cardSubtitle}>
                  Instructions: {fertilizer.instructions}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Regions: {fertilizer.region.join(", ")}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Brands: {fertilizer.brands.join(", ")}
                </Text>

                {/* Button to toggle crop details */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleToggleExpand(fertilizer._id)}
                >
                  <Text style={styles.buttonText}>
                    {expanded[fertilizer._id] ? "Hide Crops" : "See Crops"}
                  </Text>
                </TouchableOpacity>

                {/* Conditionally render crops if expanded */}
                {expanded[fertilizer._id] && (
                  <View style={styles.cropsContainer}>
                    <Text style={styles.sectionTitle}>Suitable Crops:</Text>
                    {fertilizer.suitableCrops.map((crop, index) => (
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
    flexDirection: "row", // Align the icon and input in a row
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10, // Adds space between the icon and input field
  },
  searchInput: {
    flex: 1, // Allow the TextInput to take the available space
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

export default FertilizerList;
