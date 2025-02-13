import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the context value type to hold both domain and setDomain function
interface DomainContextType {
  domain: string;
  setDomain: React.Dispatch<React.SetStateAction<string>>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined); // Start with undefined

type Props = {
  children: React.ReactNode;
};

const DomainProvider = ({ children }: Props) => {
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    const fetchDomain = async () => {
      const savedDomain = await AsyncStorage.getItem("domain");
      if (savedDomain) {
        setDomain(savedDomain); // Set the domain if it exists
      }
    };

    fetchDomain(); // Fetch domain when component mounts
  }, []);

  return (
    <DomainContext.Provider value={{ domain, setDomain }}>
      {children}
    </DomainContext.Provider>
  );
};

export { DomainContext, DomainProvider };
