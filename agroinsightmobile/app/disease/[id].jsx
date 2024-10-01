import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { images } from "../../constants"; // Adjust the path to where `images` is imported from
import Ionicons from "react-native-vector-icons/Ionicons";

const DiseaseDetails = ({ navigation }) => {
  const { id } = useLocalSearchParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/disease-alerts/${id}`
        );

        setAlert(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlertDetails();
  }, [id]);

  const handleBackPress = () => {
    router.back(); // Use navigation to go back to the previous screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header View */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={images.agroinsightlogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content View */}
      <View style={styles.content}>
        {alert && (
          <>
            <Image
              source={{ uri: alert.imageURL }}
              style={styles.alertImage}
              resizeMode="cover"
            />
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            <Text style={styles.alertDate}>
              Date: {new Date(alert.date).toLocaleDateString()}
            </Text>
            {alert.details && (
              <Text style={styles.alertDetails}>
                <Text style={styles.detailsLabel}>Details: </Text>
                {alert.details}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default DiseaseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 24,
  },
  alertImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  alertDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  alertDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  alertDetails: {
    fontSize: 16,
    color: '#555',
    marginTop: 16,
  },
  detailsLabel: {
    fontWeight: 'bold',
  },
});
