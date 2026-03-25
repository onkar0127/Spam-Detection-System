import { useState } from "react";
import { Platform } from "react-native";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function Index() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("message"); 

const API_URL =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROIDAPI
    : process.env.EXPO_PUBLIC_IOSAPI;


  const handlePredict = async () => {
    if (!text) {
      setResult("Enter some text");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await axios.post(API_URL, {
        text: text,
        type: type, 
      });

      setResult(res.data.prediction);
    } catch (error: any) {
      console.log("ERROR:", error);
      setResult("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spam Detection</Text>

      
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            type === "message" && styles.activeButton,
          ]}
          onPress={() => setType("message")}
        >
          <Text
            style={[
              styles.selectorText,
              type === "message" && styles.activeText,
            ]}
          >
            Message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorButton,
            type === "email" && styles.activeButton,
          ]}
          onPress={() => setType("email")}
        >
          <Text
            style={[
              styles.selectorText,
              type === "email" && styles.activeText,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={`Enter your ${type}...`}
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" />}

      {result ? (
        <Text style={styles.result}>Result: {result}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#dbeafe",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  selectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  selectorButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#bfdbfe",
  },
  activeButton: {
    backgroundColor: "#2563eb",
  },
  selectorText: {
    color: "#1e3a8a",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#93c5fd",
    padding: 15,
    borderRadius: 10,
    height: 120,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    color: "#1e40af",
  },
});