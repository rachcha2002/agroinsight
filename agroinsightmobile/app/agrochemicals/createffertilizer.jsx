import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createFarmerFertilizer } from "../../lib/fertilizerAPI"; // Adjust path as necessary

const CreateFarmerFertilizer = () => {
  const { user } = useGlobalContext(); // Assuming you have a context for global state
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    crop: "",
    fertilizer: "",
    amount: "",
  });

  const submit = async () => {
    if (!form.crop || !form.fertilizer || !form.amount) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      setUploading(true);

      // Call the API to create a new farmer fertilizer record
      await createFarmerFertilizer(form, setUploading, setForm);
      Alert.alert("Success", "Record created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create record. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="justify-between items-center flex-row ">
        <View className="flex-1 items-center pl-4">
          <Text className="text-2xl text-black font-semibold">Create Fertilizer Record</Text>
        </View>
      </View>
      <ScrollView className="px-4 my-6">
        {/* Form fields for crop, fertilizer, and amount */}
        <FormField
          title="Crop"
          value={form.crop}
          placeholder="Enter crop name"
          handleChangeText={(e) => setForm({ ...form, crop: e })}
          otherStyles="mt-5"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Fertilizer"
          value={form.fertilizer}
          placeholder="Enter fertilizer type"
          handleChangeText={(e) => setForm({ ...form, fertilizer: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Amount"
          value={form.amount}
          placeholder="Enter fertilizer amount"
          keyboardType="numeric" // This will show numeric keyboard for amount
          handleChangeText={(e) => setForm({ ...form, amount: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        {/* Submit Button */}
        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7 bg-green-500"
          textClass="text-white"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateFarmerFertilizer;
