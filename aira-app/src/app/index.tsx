import { Text, View, StyleSheet } from "react-native";
import SplashScreen from "./pages/SplashScreen";
import React, { useState } from "react";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Your main Aira Kitchen Console */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
