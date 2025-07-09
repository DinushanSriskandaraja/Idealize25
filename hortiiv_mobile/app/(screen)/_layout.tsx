// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="homescreen" options={{ headerShown: false }} />
      <Stack.Screen name="MyAccount" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetails" options={{ headerShown: false }} />
      <Stack.Screen name="products" options={{ headerShown: false }} />
      <Stack.Screen name="SoldItemsScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="UploadProductScreen"
        options={{ headerShown: false }}
      />
       
    </Stack>
  );
}
