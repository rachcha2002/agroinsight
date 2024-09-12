import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the GlobalContext
const GlobalContext = createContext();

// Create a custom hook to use the GlobalContext
export const useGlobalContext = () => useContext(GlobalContext);

// GlobalProvider component to wrap your app with global state
const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Boolean flag for login state
  const [user, setUser] = useState({
    name: null,
    email: null,
    imageUrl: null,
  }); // Store name, email, imageUrl in the user state
  const [isLoading, setIsLoading] = useState(true); // Loading state for app initialization or session checking

  // Load user data from AsyncStorage and parse the token
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedSession = await AsyncStorage.getItem("userSession");

        if (storedSession) {
          const sessionData = JSON.parse(storedSession);

          // Check if the session contains valid user data
          if (sessionData && sessionData.user && sessionData.user.user_metadata) {
            const { user_metadata } = sessionData.user; // Extract user_metadata from the token

            // Extract and assign the necessary fields
            const name = user_metadata.full_name || "Unknown Name";
            const email = user_metadata.email || "Unknown Email";
            const imageUrl = user_metadata.avatar_url || "default_avatar_url";

            // Set user data in Context
            setUser({ name, email, imageUrl });
            setIsLoggedIn(true);
          } else {
           // console.warn("No user metadata found in the session.");
          }
        } else {
          console.log("No session data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error loading user data from storage:", error);
      } finally {
        setIsLoading(false); // Stop loading when done
      }
    };

    loadUserData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
