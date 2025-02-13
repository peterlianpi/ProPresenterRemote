import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Vibration,
  TouchableOpacity,
  Dimensions,
  Image,
  ToastAndroid,
  TextInput,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useFetch from "@/hooks/useFetch";

// Define the Clear Group type
type ClearGroup = {
  id: {
    id: string;
    name: string;
  };
  tint: {
    red: number;
    green: number;
    blue: number;
  };
};

const LayerClear = ({
  domain,
  isTablet,
}: {
  domain: string;
  isTablet: boolean;
}) => {
  const BASE_URL = domain ? `http://${domain}/v1/clear` : "";

  const { data: groups, fetchData } = useFetch<ClearGroup[]>(
    `${BASE_URL}/groups`
  );

  const handleClearLayer = async (layer: string) => {
    await fetchData("GET", null, `${BASE_URL}/layer/${layer}`);

    triggerFeedback(`${layer} has been cleared.`);
  };

  const triggerFeedback = (message: string) => {
    Vibration.vibrate([0, 500, 600]);
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const layerMapping: Record<string, { name: string; icon: any }> = {
    "Clear Audio": {
      name: "audio",
      icon: require("@/assets/icons/clearaudio.png"),
    },
    "Clear Slides": {
      name: "slide",
      icon: require("@/assets/icons/clearslides.png"),
    },
    "Clear Props": {
      name: "props",
      icon: require("@/assets/icons/clearprops.png"),
    },
    "Clear Messages": {
      name: "messages",
      icon: require("@/assets/icons/clearmessages.png"),
    },
    "Clear Announcements": {
      name: "announcements",
      icon: require("@/assets/icons/clearannouncements.png"),
    },
    "Clear Media": {
      name: "media",
      icon: require("@/assets/icons/clearmedia.png"),
    },
    "Clear Video Input": {
      name: "video_input",
      icon: require("@/assets/icons/clearvideo_input.png"),
    },
  };

  return (
    <View style={[styles.buttonContainer, isTablet && styles.tabletLayout]}>
      {Object.keys(layerMapping).map((label) => (
        <TouchableOpacity
          key={label}
          style={styles.iconButton}
          onPress={() => handleClearLayer(layerMapping[label].name)}
        >
          <Image source={layerMapping[label].icon} style={styles.iconImage} />
          <ThemedText style={styles.label}>{label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: { flexDirection: "row", gap: 8 },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tabletLayout: { justifyContent: "space-evenly", marginTop: 30 },
  iconButton: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    transform: [{ scale: 1.05 }],
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  iconImage: { width: 60, height: 60, marginBottom: 5 },
  domainContainer: { marginTop: 20, marginHorizontal: 15 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
});

export default LayerClear;
