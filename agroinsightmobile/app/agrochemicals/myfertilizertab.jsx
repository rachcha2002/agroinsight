import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown

const FertilizersTab = () => {
  const router = useRouter();
  const { user } = useGlobalContext(); // Get the logged-in user's email
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [availableFertilizers, setAvailableFertilizers] = useState([]); // To store fertilizers from API
  const [updatedForm, setUpdatedForm] = useState({
    region: "",
    crop: "",
    fertilizer: "",
    amount: "",
  });

  // Fetch farmer fertilizers by email
  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/getbyemailff/${user?.email}`
        );
        setFertilizers(response.data.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fertilizers");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchFertilizers();
    }
  }, [user?.email]);

  // Fetch available fertilizers for the dropdown
  useEffect(() => {
    const fetchAvailableFertilizers = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/fertilizers`
        );
        setAvailableFertilizers(response.data); // Set fetched fertilizers
      } catch (error) {
        console.error("Error fetching fertilizers:", error);
      }
    };

    fetchAvailableFertilizers();
  }, []);

  // Delete a fertilizer record
  const deleteFertilizer = async (id) => {
    try {
      await axios.delete(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/deleteff/${id}`
      );
      setFertilizers((prev) => prev.filter((item) => item._id !== id));
      Alert.alert("Success", "Fertilizer record deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete fertilizer record.");
    }
  };

  // Open update modal and set the selected fertilizer data
  const openUpdateModal = (fertilizer) => {
    setSelectedFertilizer(fertilizer);
    setUpdatedForm({
      region: fertilizer.region,
      crop: fertilizer.crop,
      fertilizer: fertilizer.fertilizer,
      amount: fertilizer.amount.toString(),
    });
    setShowModal(true);
  };

  // Update fertilizer record
  const updateFertilizer = async () => {
    try {
      const { region, crop, fertilizer, amount } = updatedForm;
      await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/updateff/${selectedFertilizer._id}`,
        { region, crop, fertilizer, amount: parseFloat(amount) }
      );
      setFertilizers((prev) =>
        prev.map((item) =>
          item._id === selectedFertilizer._id
            ? { ...item, region, crop, fertilizer, amount: parseFloat(amount) }
            : item
        )
      );
      setShowModal(false);
      Alert.alert("Success", "Fertilizer record updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update fertilizer record.");
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedForm({ ...updatedForm, [field]: value });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!fertilizers.length) {
    return (
      <View style={styles.noRecordsContainer}>
        <Text style={styles.noRecordsText}>
          No records found for this email
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.contentText}>My Fertilizers</Text>
      <TouchableOpacity
        style={styles.createbutton}
        onPress={() => router.push("/agrochemicals/createffertilizer")}
      >
        <Text style={styles.createbuttonText}>Create New Fertilizer</Text>
      </TouchableOpacity>
      {fertilizers.map((item, index) => (
        <View key={index} style={styles.card}>
          {/* Two-column layout */}
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Region:</Text>
              <Text style={styles.value}>{item.region}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Crop:</Text>
              <Text style={styles.value}>{item.crop}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Fertilizer:</Text>
              <Text style={styles.value}>{item.fertilizer}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{item.amount} ml/kg</Text>
            </View>
          </View>

          {/* Comment Section */}
          <Text style={styles.label}>Comment:</Text>
          <Text style={styles.value}>
            {item.comment ? item.comment : "No expert comments"}
          </Text>

          {/* Delete and Update buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => deleteFertilizer(item._id)}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={() => openUpdateModal(item)}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Modal for updating fertilizer */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Fertilizer</Text>

            {/* Disabled Crop Input */}
            <TextInput
              style={styles.input}
              placeholder="Crop"
              value={updatedForm.crop}
              editable={false} // Disable editing of crop
            />

            {/* Disabled Region Input */}
            <TextInput
              style={styles.input}
              placeholder="Region"
              value={updatedForm.region}
              editable={false} // Disable editing of region
            />

            {/* Fertilizer Dropdown */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={updatedForm.fertilizer}
                onValueChange={(value) =>
                  handleInputChange("fertilizer", value)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select Fertilizer" value="" />
                {availableFertilizers.map((fertilizer) => (
                  <Picker.Item
                    key={fertilizer._id}
                    label={fertilizer.name}
                    value={fertilizer.name}
                  />
                ))}
              </Picker>
            </View>

            {/* Amount Input */}
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={updatedForm.amount}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange("amount", text)}
            />

            {/* Save button */}
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={updateFertilizer}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 5,
  },
  contentText: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  createbutton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  createbuttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between columns
    marginBottom: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  updateButton: {
    backgroundColor: "green",
  },
  saveButton: {
    backgroundColor: "#28a745",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
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
});

export default FertilizersTab;
