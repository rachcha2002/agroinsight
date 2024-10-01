import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { generatePDF } from "./generatepricepdf";
const marketName = "Dambulla";

function DambullaPriceCard() {
  const [Crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCrop, setSearchCrop] = useState("");
  useEffect(() => {
    async function getCrops() {
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/crop/croplist`);
        const filteredCrops = res.data.filter(
          (crop) => crop.Market === "Dambulla"
        );
        setLoading(false);
        setCrops(filteredCrops);
      } catch (err) {
        console.error(err);
      }
    }
    getCrops();
  }, []);

  const filteredCrops = Crops.filter((Crop) =>
    Crop.Crop_name.toLowerCase().includes(searchCrop.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="p-5">
      <View className="mb-5">
        <View className="flex flex-row items-center justify-between space-x-4 w-full h-14 px-4 bg-[#4CAF50] rounded-2xl border-2 border-[#4CAF50]">
          <TextInput
            className="text-base mt-1 text-white flex-1 font-pregular"
            placeholder="Search Crop"
            placeholderTextColor="#FFFFFF" 
            value={searchCrop}
            onChangeText={setSearchCrop}
          />
          <TouchableOpacity onPress={() => setSearchCrop("")}>
            <View
              style={{
                backgroundColor: "#387F39",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <Text className="text-white mt-1 font-pregular">Clear</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start", // Align the button to the left
                marginTop: 10,
              }}
            >
        <TouchableOpacity onPress={() => generatePDF(Crops, marketName)}>
          <View  style={{
        backgroundColor: "#dc3545",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
      }}>
          <Text className="text-white ">Generate PDF</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>

      {filteredCrops.map((Crop) => (
        <View key={Crop._id} style={styles.card}>
          <Image source={{ uri: Crop.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.cropName}>{Crop.Crop_name}</Text>
            <Text style={styles.price}>Price Per 1kg: Rs. {Crop.Price}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default DambullaPriceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  cropName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    color: "#333",
  },
});