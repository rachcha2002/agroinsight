import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const rotatorDetailsLayout = () => {
  return (
    <>
      <Stack>
         <Stack.Screen
          name="[model]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f3f6f4" style="dark" />
    </>
  );
};

export default rotatorDetailsLayout;
