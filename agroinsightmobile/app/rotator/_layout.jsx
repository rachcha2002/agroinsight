import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const rotatorLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="[id]"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="farmerdetails"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rotationmodels"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="details"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f3f6f4" style="dark" />
    </>
  );
};

export default rotatorLayout;
