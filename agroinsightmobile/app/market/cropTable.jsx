// CropTable.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const CropTable = ({ crops }) => {
  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <Text style={styles.header}>Crop Name</Text>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>Price{"\n"}(Per 1kg)</Text>
      </View>
      <ScrollView>
      {crops.map((crop, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{crop.Crop_name}</Text>
          <Text style={styles.cell}>{crop.date}</Text>
          <Text style={styles.cell}>Rs.{crop.Price}</Text>
        </View>
      ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
    table: {
      margin: 10,
      borderWidth: 1,
      borderColor: "#4CAF50",
      borderRadius: 10,
      overflow: "hidden", 
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderColor: "#4CAF50",
    },
    header: {
      fontWeight: "bold",
      color: "#387F39",
      flex: 1,
      textAlign: "center",
    },
    cell: {
      color: "#000",
      flex: 1,
      textAlign: "center",
    },
    cropName: {
      flex: 1,
    },
    date: {
      flex: 1,
    },
    price: {
      flex: 1,
    },
  });
export default CropTable;
