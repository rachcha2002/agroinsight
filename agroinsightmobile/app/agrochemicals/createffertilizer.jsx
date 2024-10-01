import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import axios from "axios";

const CreateFarmerFertilizer = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [form, setForm] = useState({
    crop: "",
    fertilizer: "",
    amount: "",
    region: "", // New field for region
  });
  const [loading, setLoading] = useState(false);
  const [fertilizers, setFertilizers] = useState([]);

  // Fetch fertilizers from API
  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/fertilizers`
        );
        setFertilizers(response.data); // Set fetched fertilizers
      } catch (error) {
        console.error("Error fetching fertilizers:", error);
      }
    };

    fetchFertilizers();
  }, []);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateFields = () => {
    if (!form.crop || !form.fertilizer || !form.amount || !form.region) {
      Alert.alert("Error", "Please fill in all the fields.");
      return false;
    }

    if (form.crop.length < 3) {
      Alert.alert("Error", "Crop name must be at least 3 characters long.");
      return false;
    }

    if (isNaN(form.amount) || form.amount <= 0) {
      Alert.alert("Error", "Amount should be a positive number.");
      return false;
    }

    if (form.region.length < 3) {
      Alert.alert("Error", "Region name must be at least 3 characters long.");
      return false;
    }

    return true;
  };

  const submitForm = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      // Assuming this is the API endpoint for creating a farmer fertilizer record
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/addff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop: form.crop,
            fertilizer: form.fertilizer,
            amount: parseFloat(form.amount), // Ensure amount is sent as a number
            region: form.region, // Include region in the payload
            email: user?.email || "abc@gmail.com",
          }),
        }
      );

      // Log the response for debugging
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("API Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      Alert.alert("Success", "Farmer fertilizer record created successfully!");

      // Navigate to MyAgrochemicalsScreen and activate the "Pesticides" tab
      router.push({
        pathname: "/agrochemicals/myagrochemicals",
        params: { activeTab: "Fertilizers" },
      });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          {/* Back button with Ionicons */}
          <TouchableOpacity
            onPress={() => router.back()}
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
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Create Fertilizer Record</Text>

          {/* Crop Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Crop</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter crop name"
              value={form.crop}
              onChangeText={(text) => handleInputChange("crop", text)}
            />
          </View>

          {/* Fertilizer Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Fertilizer</Text>
            <Picker
              selectedValue={form.fertilizer}
              onValueChange={(value) => handleInputChange("fertilizer", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Fertilizer" value="" />
              {fertilizers.map((fertilizer) => (
                <Picker.Item
                  key={fertilizer._id}
                  label={fertilizer.name}
                  value={fertilizer.name}
                />
              ))}
            </Picker>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount(ml/kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter fertilizer amount"
              value={form.amount}
              onChangeText={(text) => handleInputChange("amount", text)}
              keyboardType="numeric"
            />
          </View>

          {/* Region Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter region"
              value={form.region}
              onChangeText={(text) => handleInputChange("region", text)}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={submitForm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#ffffff",
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
  logo: {
    width: 150,
    height: 40,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginVertical: 15,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default CreateFarmerFertilizer;
