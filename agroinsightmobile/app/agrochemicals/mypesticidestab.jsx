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
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown

const PesticidesTab = () => {
  const router = useRouter();
  const { user } = useGlobalContext(); // Get the logged-in user's email
  const [pesticides, setPesticides] = useState([]);
  const [availablePesticides, setAvailablePesticides] = useState([]); // To store available pesticides from API
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPesticide, setSelectedPesticide] = useState(null);
  const [updatedForm, setUpdatedForm] = useState({
    region: "",
    crop: "",
    pesticide: "",
    amount: "",
    targetPest: "",
  });

  // Fetch farmer pesticides by email
  useEffect(() => {
    const fetchPesticides = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/getbyemailfp/${user?.email}`
        );
        setPesticides(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle the 404 case by setting pesticides to an empty array
          setPesticides([]);
        } else {
          Alert.alert("Error", "Failed to fetch pesticides");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPesticides();
    }
  }, [user?.email]);

  // Fetch available pesticides for the dropdown
  useEffect(() => {
    const fetchAvailablePesticides = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/pesticides`
        );
        setAvailablePesticides(response.data); // Set fetched pesticides
      } catch (error) {
        console.error("Error fetching pesticides:", error);
      }
    };

    fetchAvailablePesticides();
  }, []);

  // Delete a pesticide record
  const deletePesticide = async (id) => {
    try {
      await axios.delete(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/deletefp/${id}`
      );
      setPesticides((prev) => prev.filter((item) => item._id !== id));
      Alert.alert("Success", "Pesticide record deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete pesticide record.");
    }
  };

  // Open update modal and set the selected pesticide data
  const openUpdateModal = (pesticide) => {
    setSelectedPesticide(pesticide);
    setUpdatedForm({
      region: pesticide.region,
      crop: pesticide.crop,
      pesticide: pesticide.pesticide,
      amount: pesticide.amount.toString(),
      targetPest: pesticide.targetPest,
    });
    setShowModal(true);
  };

  // Update pesticide record
  const updatePesticide = async () => {
    try {
      const { region, crop, pesticide, amount, targetPest } = updatedForm;
      await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/updatefp/${selectedPesticide._id}`,
        { region, crop, pesticide, amount: parseFloat(amount), targetPest }
      );
      setPesticides((prev) =>
        prev.map((item) =>
          item._id === selectedPesticide._id
            ? {
                ...item,
                region,
                crop,
                pesticide,
                amount: parseFloat(amount),
                targetPest,
              }
            : item
        )
      );
      setShowModal(false);
      Alert.alert("Success", "Pesticide record updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update pesticide record.");
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.contentText}>My Pesticides</Text>

      {/* Always show the create button */}
      <TouchableOpacity
        style={styles.createbutton}
        onPress={() => router.push("/agrochemicals/createfpesticide")}
      >
        <Text style={styles.createbuttonText}>Create New Pesticide</Text>
      </TouchableOpacity>

      {/* If no pesticides exist, show a message */}
      {!pesticides.length ? (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>
            No records found for this email
          </Text>
        </View>
      ) : (
        pesticides.map((item, index) => (
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
                <Text style={styles.label}>Pesticide:</Text>
                <Text style={styles.value}>{item.pesticide}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.value}>{item.amount} ml</Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Target Pest:</Text>
              <Text style={styles.value}>{item.targetPest}</Text>
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
                onPress={() => deletePesticide(item._id)}
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
        ))
      )}

      {/* Modal for updating pesticide */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Pesticide</Text>

            {/* Disabled Region Input */}
            <TextInput
              style={styles.input}
              placeholder="Region"
              value={updatedForm.region}
              editable={false} // Disable editing of region
            />

            {/* Disabled Crop Input */}
            <TextInput
              style={styles.input}
              placeholder="Crop"
              value={updatedForm.crop}
              editable={false} // Disable editing of crop
            />

            {/* Pesticide Dropdown */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={updatedForm.pesticide}
                onValueChange={(value) => handleInputChange("pesticide", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Pesticide" value="" />
                {availablePesticides.map((pesticide) => (
                  <Picker.Item
                    key={pesticide._id}
                    label={pesticide.name}
                    value={pesticide.name}
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

            {/* Target Pest Input */}
            <TextInput
              style={styles.input}
              placeholder="Target Pest"
              value={updatedForm.targetPest}
              onChangeText={(text) => handleInputChange("targetPest", text)}
            />

            {/* Save button */}
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={updatePesticide}
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
    justifyContent: "space-between",
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
  noRecordsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noRecordsText: {
    fontSize: 18,
    color: "#666",
  },
});

export default PesticidesTab;
