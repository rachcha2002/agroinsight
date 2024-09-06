import { router } from "expo-router";
import { Alert } from "react-native";

export const uploadDiseaseData = async (form, setUploading, setForm) => {
  if (form.symptoms === "" || !form.diseaseImage) {
    return Alert.alert("Please provide all fields, including an image.");
  }

  setUploading(true);

  const formData = new FormData();
  formData.append("farmerID", form.farmerID); // Replace with the actual farmer ID
  formData.append("area", "Central Province");
  formData.append("cropAffected", form.cropAffected);
  formData.append("complaintDescription", form.symptoms);
  formData.append("dateOfComplaint", new Date().toISOString().split("T")[0]); // Automatically set to the current date

  console.log("Form data:", form.diseaseImage);
  formData.append("diseaseImage", {
    uri: form.diseaseImage.uri,
    name: form.diseaseImage.fileName || "image.jpg",
    type: form.diseaseImage.mimetype || "image/jpeg",
  });

  try {
    const response = await fetch(
      "http://192.168.1.167:5000/api/disease/complaints",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      Alert.alert("Success", "Data uploaded successfully.");
      router.push("/disease/complaints");
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      Alert.alert("Error", "Failed to upload data.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    Alert.alert("Error", "Failed to upload data.");
  } finally {
    setForm({
      symptoms: "",
      diseaseImage: null,
    });

    setUploading(false);
  }
};
