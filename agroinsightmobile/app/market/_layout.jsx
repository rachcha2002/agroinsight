import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _marketlayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="dailyprice"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pricehistory"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f3f6f4" style="dark" />
    </>
  );
};

export default _marketlayout;
