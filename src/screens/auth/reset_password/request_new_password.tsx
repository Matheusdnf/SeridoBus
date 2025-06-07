import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";

export default function Request_New_Password() {
  const [code, setCode] = useState(Array(5).fill(""));
  const [touched, setTouched] = useState(false);
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation();

  const handleChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    setTouched(true);
    const isComplete = code.every((char) => char !== "");
    if (isComplete) {
      console.log("Código inserido:", code.join(""));
      navigation.navigate("NovaSenha" as never); // altere conforme o nome da rota
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-gray-100`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-1 justify-center items-center px-4`}
      >
        <View style={tw`bg-white p-6 rounded-2xl shadow w-full max-w-md`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`absolute top-4 left-4 p-2`}
          >
            <Icon name="arrow-left" size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text style={tw`text-2xl font-bold text-center mb-2`}>
            Redefinição de senha
          </Text>
          <Text style={tw`text-center text-gray-600 mb-6`}>
            Insira o código recebido no email
          </Text>

          <View style={tw`flex-row justify-center gap-2 mb-6`}>
            {code.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputsRef.current[index] = ref;
                }}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                style={tw.style(
                  `w-12 h-12 text-xl text-center border-2 rounded-lg`,
                  touched && value === "" ? "border-red-500" : "border-gray-300"
                )}
              />
            ))}
          </View>

          <TouchableOpacity
            style={tw`bg-indigo-600 p-3 rounded`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white text-center font-medium`}>
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
