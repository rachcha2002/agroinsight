import React, { useState, useEffect } from 'react';
import { Button, View, Text, Linking,Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { supabase } from '../lib/supabase'; // Your Supabase client setup
import { router } from 'expo-router'; // Import the router from expo-router
import { useGlobalContext } from '../context/GlobalProvider'; // Import your Global Context
import {images,icons} from '../constants'

export default function App() {
  const { setUser: setGlobalUser, setIsLoggedIn } = useGlobalContext(); // Access the context's setUser function
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To manage loading state while fetching the session

  // Function to load and validate session from AsyncStorage
  const loadSession = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const parsedSession = JSON.parse(session);
        
        // Validate session by setting it with supabase.auth.setSession
        const { data, error } = await supabase.auth.setSession({
          access_token: parsedSession.access_token,
          refresh_token: parsedSession.refresh_token,
        });

        if (error) {
          console.error('Error setting session:', error.message);
          setError('Failed to restore session.');
          setIsLoading(false);
        } else if (data?.session?.user) {
          // Session is valid, update global state
          const user = data.session.user;
          setGlobalUser({
            name: user.user_metadata.full_name,
            email: user.email,
            imageUrl: user.user_metadata.avatar_url,
          });
          setIsLoggedIn(true);
          router.push('/home'); // Automatically navigate to home if session exists and is valid
        }
      } else {
        // No session found
        setIsLoading(false); // If no session, stop loading and allow sign in
      }
    } catch (err) {
      console.error('Failed to load session from storage:', err);
      setError('Failed to load session.');
      setIsLoading(false);
    }
  };

  // Load session on app start
  useEffect(() => {
    loadSession();
  }, []);

  // Handle deep link and set the session after Google sign-in
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      console.log('Handling deep link: ', url);

      const params = new URLSearchParams(url.split('#')[1]); // Extracting the fragment part of the URL (after #)
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken) {
        // Store tokens in Supabase and handle the session manually
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error.message);
          setError('Failed to authenticate.');
        } else {
          const user = data.session.user;
         // console.log('Session data:', user);

          // Save session to AsyncStorage
          await AsyncStorage.setItem(
            'userSession',
            JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          );

          // Set user data in GlobalContext
          setGlobalUser({
            name: user.user_metadata.full_name,
            email: user.email,
            imageUrl: user.user_metadata.avatar_url,
          });

          setIsLoggedIn(true); // Mark user as logged in

          // Navigate to the home page after receiving the token
          router.push('/home'); // Redirect to the home page
        }
      } else {
        setError('No access token found in the URL');
      }
    };

    // Add an event listener for deep linking
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Clean up the event listener
    return () => {
      subscription.remove();
    };
  }, []);

  // Handle Google OAuth login
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'exp://192.168.1.2:8081', // Your development redirect URI
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      setError('Failed to start the OAuth process.');
    } else if (data) {
      // Open the Google OAuth URL with Linking
      Linking.openURL(data.url);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Logo Section */}
      <View className="mb-16 items-center">
        <Image 
          source={images.agroinsightlogo} // Replace with your actual logo path
          className="w-80 h-28 object-contain" // Adjusted the size for a larger logo
        />
       <Text className="text-center mt-20 text-lg italic text-gray-800 font-bold">
  Unlock Better Agriculture with
</Text>
<Text className="text-center text-xl italic text-green-900 font-bold">
  AgroInsight
</Text>

      </View>
  
      {/* Google Sign-in Button */}
      {isLoading ? (
       <ActivityIndicator size="large" color="#4CAF50" /> 
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : (
        <TouchableOpacity 
          onPress={signInWithGoogle} 
          className="flex-row items-center px-6 py-3 bg-green-600 rounded-full shadow-lg"
        >
          <Image 
            source={images.googlelogo} // Replace with the actual Google logo path
            className="w-6 h-6 mr-3"
          />
          <Text className="text-white text-lg font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
}
