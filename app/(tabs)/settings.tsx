import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePingTest from "@/hooks/usePingTest";
import { DomainContext } from "@/provider/use-domain";

const SettingsPage = () => {
  // Manage domain and server status in state
  const domainContext = useContext(DomainContext);

  if (!domainContext) {
    return;
  }

  const { domain, setDomain } = domainContext;
  const [controlPassword, setControlPassword] = useState<string>("");
  const [observerPassword, setObserverPassword] = useState<string>("");
  const [stagePassword, setStagePassword] = useState<string>("");

  // Use the custom hook to manage server status and ping test
  const { serverStatus, pingTest } = usePingTest(domain);

  // Load saved data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const savedDomain = await AsyncStorage.getItem("domain");
      const savedControlPassword = await AsyncStorage.getItem(
        "controlPassword"
      );
      const savedObserverPassword = await AsyncStorage.getItem(
        "observerPassword"
      );
      const savedStagePassword = await AsyncStorage.getItem("stagePassword");

      if (savedDomain) setDomain(savedDomain);
      if (savedControlPassword) setControlPassword(savedControlPassword);
      if (savedObserverPassword) setObserverPassword(savedObserverPassword);
      if (savedStagePassword) setStagePassword(savedStagePassword);
    };
    loadSettings();
  }, []);

  // Handle saving the form data to AsyncStorage
  const handleSaveSettings = async () => {
    await AsyncStorage.setItem("domain", domain);
    await AsyncStorage.setItem("controlPassword", controlPassword);
    await AsyncStorage.setItem("observerPassword", observerPassword);
    await AsyncStorage.setItem("stagePassword", stagePassword);

    ToastAndroid.show("Settings saved successfully!", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter domain"
        value={domain}
        onChangeText={setDomain}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter control password (optional)"
        value={controlPassword}
        onChangeText={setControlPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Enter observer password (optional)"
        value={observerPassword}
        onChangeText={setObserverPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Enter stage password (optional)"
        value={stagePassword}
        onChangeText={setStagePassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* Ping Test Button */}
      <TouchableOpacity
        style={[
          styles.pingButton,
          {
            backgroundColor:
              serverStatus === null ? "#ccc" : serverStatus ? "green" : "red",
          },
        ]}
        onPress={pingTest}
      >
        <Text style={styles.buttonText}>Ping Test</Text>
      </TouchableOpacity>

      {serverStatus !== null && (
        <Text style={styles.statusText}>
          {serverStatus ? "Server is Active" : "Server is Inactive"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F7F8", // Light background color
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#007AFF", // iOS blue
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  pingButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});

export default SettingsPage;
