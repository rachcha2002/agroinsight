import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Platform,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { styled } from "nativewind";
import { images } from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import CropTable from "./cropTable"; // Adjust the path as necessary

const Tab = createMaterialTopTabNavigator();
const StyledTabBar = styled(Tab.Navigator);

const pricehistory = () => {
  const router = useRouter();

  const [Crops, setCrops] = useState([]);
  const [searchCrop, setSearchCrop] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [initdate, setInitDate] = useState(null);

  useEffect(() => {
    async function getCrops() {
      try {
        const res = await axios.get(
          `http://192.168.8.183:5000/crop/gethistory`
        );
        const filteredCrops = res.data;
        setCrops(filteredCrops);

        if (filteredCrops.length > 0) {
          const earliestDate = filteredCrops.reduce((earliest, crop) => {
            const cropDate = parseDate(crop.date);
            return cropDate < earliest ? cropDate : earliest;
          }, parseDate(filteredCrops[0].date));

          setFromDate(earliestDate);
          setInitDate(earliestDate);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getCrops();
  }, []);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const filteredCrops = Crops.filter((crop) => {
    const cropNameMatch = capitalizeFirstLetter(crop.Crop_name).includes(
      capitalizeFirstLetter(searchCrop)
    );
    const cropDate = parseDate(crop.date);
    const fromDateMatch = !fromDate || cropDate >= fromDate;
    const toDateMatch = !toDate || cropDate <= toDate;
    return cropNameMatch && fromDateMatch && toDateMatch;
  }).sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.push("/market")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={images.agroinsightlogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mx-4 flex flex-row items-center justify-between space-x-4 w- h-14 px-4 bg-[#4CAF50] rounded-2xl border-2 border-[#4CAF50]">
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
        <View className="mx-4 flex flex-row justify-between space-x-4 mb-4">
          <View style={{ flex: 1 }}>
            <Text className="text-[#387F39] mt-1 font-pregular">From Date</Text>
            <View className="flex-row items-center justify-between space-x-4 h-14 px-4 bg-[#ffffff] rounded-2xl border-2 border-[#4CAF50]">
              <TouchableOpacity
                className="flex-1"
                onPress={() => setShowFromDatePicker(true)}
              >
                <Text className="text-[#387F39] mt-1 font-pregular">
                  {fromDate
                    ? fromDate.toLocaleDateString()
                    : "Select From Date"}
                </Text>
              </TouchableOpacity>
              {fromDate && (
                <TouchableOpacity onPress={() => setFromDate(initdate)}>
                  <Text className="text-[#387F39] mt-1 font-pregular">
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(false);
                  if (selectedDate) setFromDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text className="text-[#387F39] mt-1 font-pregular">To Date</Text>
            <View className="flex-row items-center justify-between space-x-4 h-14 px-4 bg-[#ffffff] rounded-2xl border-2 border-[#4CAF50]">
              <TouchableOpacity
                className="flex-1"
                onPress={() => setShowToDatePicker(true)}
              >
                <Text className="text-[#387F39] mt-1 font-pregular">
                  {toDate ? toDate.toLocaleDateString() : "Select To Date"}
                </Text>
              </TouchableOpacity>
              {toDate && (
                <TouchableOpacity onPress={() => setToDate(new Date())}>
                  <Text className="text-[#387F39] mt-1 font-pregular">
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(false);
                  if (selectedDate) setToDate(selectedDate);
                }}
              />
            )}
          </View>
        </View>

        <StyledTabBar
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, color: "white" },
            tabBarStyle: { backgroundColor: "#387F39" },
            tabBarIndicatorStyle: {
              backgroundColor: "#4CAF50",
              height: "100%",
              borderRadius: 5,
            },
          }}
        >
          <Tab.Screen name="Colombo">
            {() => (
              <CropTable
                crops={filteredCrops.filter(
                  (crop) => crop.Market === "Colombo"
                )}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Dambulla">
            {() => (
              <CropTable
                crops={filteredCrops.filter(
                  (crop) => crop.Market === "Dambulla"
                )}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Jaffna">
            {() => (
              <CropTable
                crops={filteredCrops.filter((crop) => crop.Market === "Jaffna")}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Galle">
            {() => (
              <CropTable
                crops={filteredCrops.filter((crop) => crop.Market === "Galle")}
              />
            )}
          </Tab.Screen>
        </StyledTabBar>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
  },
};

export default pricehistory;
