import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      paddingVertical: 50,
      paddingHorizontal: 10,
    },
  
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 50,
    },
  
    headerText: {
      fontSize: 20,
      fontWeight: 700,
    },
  
    input: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: "#A5D6A7",
      fontWeight: "500",
      color: "#263238",
    },
  
    roleButton: {
      borderWidth: 1.5,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  
    roleText: {
      fontSize: 15,
      fontWeight: 500,
      color: "#263238",
    },
  
    loginButtonContainer: {
      backgroundColor: "#4CAF50",
      width: "100%",
      paddingVertical: 15,
      borderRadius: 20,
    },
  
    loginButton: {
      textAlign: "center",
      color: "#fff",
      fontWeight: 600,
      fontSize: 18,
    },
  });

  export default styles