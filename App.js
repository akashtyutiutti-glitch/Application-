// App.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [input, setInput] = useState("");
  const [secretPIN, setSecretPIN] = useState("1234"); // Default PIN
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newPIN, setNewPIN] = useState("");
  const [changingPIN, setChangingPIN] = useState(false);

  const handlePress = (value) => setInput(input + value);

  const handleClear = () => setInput("");

  const handleEqual = () => {
    if (input === secretPIN) {
      setIsUnlocked(true);
      setInput("");
    } else {
      try {
        let result = eval(input).toString();
        setInput(result);
      } catch {
        Alert.alert("Error", "Invalid Input");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleChangePIN = () => {
    if (newPIN.length < 3) {
      Alert.alert("Error", "PIN must be at least 3 digits");
      return;
    }
    setSecretPIN(newPIN);
    setNewPIN("");
    setChangingPIN(false);
    Alert.alert("Success", "PIN Changed Successfully!");
  };

  if (isUnlocked) {
    return (
      <View style={styles.hiddenContainer}>
        <Text style={styles.hiddenText}>🔒 Hidden Vault</Text>

        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Text style={styles.btnText}>+ Add Photo</Text>
        </TouchableOpacity>

        {changingPIN ? (
          <View style={styles.pinBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter New PIN"
              placeholderTextColor="#888"
              value={newPIN}
              onChangeText={setNewPIN}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleChangePIN}>
              <Text style={styles.btnText}>Save New PIN</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setChangingPIN(true)}>
            <Text style={styles.btnText}>Change PIN</Text>
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.photoContainer}>
          {photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.photo} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={input} editable={false} />
      {[
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        ["0", "C", "=", "+"],
      ].map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.button}
              onPress={() => {
                if (item === "C") handleClear();
                else if (item === "=") handleEqual();
                else handlePress(item);
              }}
            >
              <Text style={styles.btnText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#111" },
  input: { height: 70, backgroundColor: "#222", color: "#fff", fontSize: 30, textAlign: "right", margin: 10, borderRadius: 10, padding: 10 },
  row: { flexDirection: "row", justifyContent: "space-around", marginVertical: 5 },
  button: { backgroundColor: "#333", padding: 20, borderRadius: 10, minWidth: 70, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 20 },
  hiddenContainer: { flex: 1, backgroundColor: "#000", padding: 20 },
  hiddenText: { color: "#0f0", fontSize: 22, marginBottom: 20, textAlign: "center" },
  addBtn: { backgroundColor: "#444", padding: 15, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  photoContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  photo: { width: 100, height: 100, margin: 5, borderRadius: 10 },
  pinBox: { marginVertical: 20 },
});
