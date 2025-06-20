import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchWallet, topUpWallet } from "@/src/services/api";

export default function Wallet() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);

  const loadWallet = async () => {
    try {
      const data = await fetchWallet();
      setWalletData(data);
    } catch (error) {
      console.error("Error loading wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWallet();
    setRefreshing(false);
  };

  const handleTopUp = async () => {
    try {
      const amount = 1000; // Example amount
      await topUpWallet(amount);
      Alert.alert("Success", "Wallet topped up successfully");
      loadWallet();
    } catch (error: any) {
      Alert.alert(
        "Top Up Failed",
        error.response?.data?.message || "Failed to top up wallet"
      );
    }
  };

  useEffect(() => {
    loadWallet();
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
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.balance}>
          Balance: ₦{walletData?.balance?.toLocaleString() || "0"}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleTopUp}>
          <Text style={styles.buttonText}>Top Up Wallet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {walletData?.transactions?.length > 0 ? (
          walletData.transactions.map((transaction: any, index: number) => (
            <View key={index} style={styles.transaction}>
              <Text style={styles.transactionTitle}>{transaction.type}</Text>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === "credit" ? "#4CAF50" : "#F44336",
                  },
                ]}
              >
                ₦{transaction.amount.toLocaleString()}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No transactions yet</Text>
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
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  transaction: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  transactionDate: {
    color: "#666",
    fontSize: 14,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
}); 