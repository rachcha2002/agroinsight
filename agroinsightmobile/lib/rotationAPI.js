import { router } from "expo-router";
import { Alert } from "react-native";

export const uploadRotatorDetails = async (form, setUploading, setForm) => {
  if (!form.farmerId ||!form.region ||!form.season || !form.currentCrop || !form.status ) {
    return Alert.alert("Please provide all fields.");
  }

  setUploading(true);

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/rotator-detail`,
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            farmerId: form.farmerId,
            region: form.region,
            season: form.season,
            currentCrop: form.currentCrop,
            status: form.status,
          }),
      }
    );

    if (response.ok) {
      Alert.alert("Success", "Details uploaded successfully.");
      router.push("/rotator/farmerdetails");
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      Alert.alert("Error", "Failed to upload details.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    Alert.alert("Error", "Failed to upload details.");
  } finally {
    setForm({
        region: "",
        season: "",
        currentCrop: "",
        status: "",
    });

    setUploading(false);
  }
};
