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
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const CreateFarmerPesticide = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [form, setForm] = useState({
    crop: "",
    pesticide: "",
    amount: "",
    targetPest: "",
  });
  const [loading, setLoading] = useState(false);
  const [pesticides, setPesticides] = useState([]);

  // Fetch pesticides from API
  useEffect(() => {
    const fetchPesticides = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/pesticides`
        );
        setPesticides(response.data); // Set fetched pesticides
      } catch (error) {
        console.error("Error fetching pesticides:", error);
      }
    };

    fetchPesticides();
  }, []);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitForm = async () => {
    if (!form.crop || !form.pesticide || !form.amount || !form.targetPest) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    if (isNaN(form.amount) || form.amount <= 0) {
      Alert.alert("Error", "Amount should be a positive number.");
      return;
    }

    setLoading(true);

    try {
      // Assuming this is the API endpoint for creating a farmer pesticide record
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/addfp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop: form.crop,
            pesticide: form.pesticide,
            amount: parseFloat(form.amount), // Ensure amount is sent as a number
            targetPest: form.targetPest,
            email: user?.email || "abc@gmail.com",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      Alert.alert("Success", "Farmer pesticide record created successfully!");

      // Navigate to MyAgrochemicalsScreen and activate the "Pesticides" tab
      router.push({
        pathname: "/agrochemicals/myagrochemicals",
        params: { activeTab: "Pesticides" },
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back(); // Try to go back
              } else {
                router.push("/agrochemicals/myagrochemicals"); // If can't go back, push to a specific route
              }
            }} // Ensure this route exists // Ensure this route exists
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
          <Text style={styles.title}>Create Farmer Pesticide Record</Text>

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

          {/* Pesticide Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Pesticide</Text>
            <Picker
              selectedValue={form.pesticide}
              onValueChange={(value) => handleInputChange("pesticide", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Pesticide" value="" />
              {pesticides.map((pesticide) => (
                <Picker.Item
                  key={pesticide._id}
                  label={pesticide.name}
                  value={pesticide.name}
                />
              ))}
            </Picker>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pesticide amount"
              value={form.amount}
              onChangeText={(text) => handleInputChange("amount", text)}
              keyboardType="numeric"
            />
          </View>

          {/* Target Pest Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Target Pest</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter target pest"
              value={form.targetPest}
              onChangeText={(text) => handleInputChange("targetPest", text)}
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

export default CreateFarmerPesticide;
