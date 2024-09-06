import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const diseaseLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="createcomplaint"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="complaints"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f3f6f4" style="dark" />
    </>
  );
};

export default diseaseLayout;
