import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import LayerClear from "@/features/clear/layer-clear";
import GroupClear from "@/features/clear/group-clear";
import ParallaxScrollView2 from "@/components/ParallaxScrollView2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePingTest from "@/hooks/usePingTest";

const ControlScreen = () => {
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;

  // Manage domain and server status in state
  const [domain, setDomain] = useState<string | null>(null);
  const { serverStatus, pingTest } = usePingTest(domain || "");

  useEffect(() => {
    // Function to fetch domain from AsyncStorage
    const fetchDomain = async () => {
      const savedDomain = await AsyncStorage.getItem("domain");
      setDomain(savedDomain);
    };

    fetchDomain(); // Fetch domain when the component mounts

    // Listen for changes in domain stored in AsyncStorage
    const interval = setInterval(() => {
      fetchDomain(); // Re-fetch every 2 seconds to check for domain updates
    }, 2000);

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (domain) {
      pingTest(); // Call pingTest if domain changes
    }
  }, [domain]); // Run when domain updates

  return (
    <ParallaxScrollView2>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Control</ThemedText>
      </ThemedView>

      {/* Check if domain exists */}
      {domain ? (
        <>
          {/* Server Status LED Indicator */}
          <View style={styles.statusContainer}>
            <ThemedText>Your domain: {domain}</ThemedText>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    serverStatus === null
                      ? "#ccc"
                      : serverStatus
                      ? "green"
                      : "red",
                },
              ]}
            />
          </View>

          <LayerClear domain={domain} isTablet={isTablet} />
          <GroupClear domain={domain} isTablet={isTablet} />
        </>
      ) : (
        <ThemedText>No domain defined</ThemedText> // Message when no domain is defined
      )}
    </ParallaxScrollView2>
  );
};

const styles = StyleSheet.create({
  titleContainer: { flexDirection: "row", gap: 8 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 70,
    marginTop: 10,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  pingButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
});

export default ControlScreen;
