import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { fetchDashboard } from "@/src/services/api";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      const data = await fetchDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.welcome}>
          Welcome back, {dashboardData?.user?.fullName}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Profile</Text>
        {dashboardData?.profile ? (
          <View style={styles.card}>
            <Text>Age: {dashboardData.profile.age}</Text>
            <Text>Gender: {dashboardData.profile.gender}</Text>
            <Text>Location: {dashboardData.profile.location}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/health-profile")}
          >
            <Text style={styles.buttonText}>Complete Your Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest AI Recommendation</Text>
        {dashboardData?.latest_ai_recommendation ? (
          <View style={styles.card}>
            <Text>Risk Level: {dashboardData.latest_ai_recommendation.predicted_risk}</Text>
            <Text>Suggested Goals: {dashboardData.latest_ai_recommendation.suggested_goals}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>No recommendations yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
}); 