import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSavedDomain = async () => {
  const savedDomain = await AsyncStorage.getItem("domain");
  return savedDomain;
};
