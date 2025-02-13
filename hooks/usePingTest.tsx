import { useState } from "react";
import { Platform, ToastAndroid } from "react-native";

// Ping test function
const checkServerStatus = async (domain: string) => {
  try {
    const response = await fetch(`http://${domain}/v1/control`, {
      method: "GET",
    });
    return response.ok; // If the response is OK, the server is active
  } catch (error) {
    return false; // Server is unreachable or inactive
  }
};

const usePingTest = (domain: string) => {
  const [serverStatus, setServerStatus] = useState<boolean | null>(null); // null = not checked yet, true = active, false = inactive

  const pingTest = async () => {
    if (!domain) {
      alert("Please enter a valid domain first.");
      return;
    }

    setServerStatus(null); // Reset status before testing
    const isServerActive = await checkServerStatus(domain);
    // Show Toast for Android, or use alert for iOS
    if (Platform.OS === "android") {
      if (isServerActive) {
        ToastAndroid.show("Server is Active", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Server is Inactive", ToastAndroid.SHORT);
      }
    } else {
      alert(isServerActive ? "Server is Active" : "Server is Inactive");
    }
    setServerStatus(isServerActive);
  };

  return {
    serverStatus,
    pingTest,
  };
};

export default usePingTest;
