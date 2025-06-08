import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { validatePassword } from "../../../validations/input_validations";

export default function New_Password() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordEdited, setPasswordEdited] = useState(false);
  const [confirmEdited, setConfirmEdited] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleChange = (
    field: "password" | "confirm_password",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validarFormulario = (): boolean => {
    const isPasswordValid = validatePassword(formData.password);
    const isSame = formData.password === formData.confirm_password;
    let isValid = true;
    console.log(formData.password);
    console.log(isPasswordValid);
    if (isPasswordValid) {
      setPasswordError("A senha deve conter pelo menos 5 caracteres.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!isSame) {
      setConfirmError("As senhas não coincidem.");
      isValid = false;
    } else {
      setConfirmError(null);
    }

    return isValid;
  };

  const enviarNovaSenha = () => {
    setPasswordEdited(true);
    setConfirmEdited(true);

    if (validarFormulario()) {
      console.log("Senha válida:", formData.password);
      //   passa o nome do arquivo .tsx
      navigation.navigate("Login" as never);
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
        <View style={tw`bg-white p-6 rounded-xl w-full max-w-md shadow`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mb-4`}
          >
            <Text style={tw`text-indigo-500`}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={tw`text-2xl font-bold text-center text-indigo-600 mb-2`}>
            Nova Senha
          </Text>
          <Text style={tw`text-sm text-center text-gray-500 mb-6`}>
            Coloque a sua nova senha
          </Text>

          {/* Campo: Senha */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Senha
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="lock" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="Nova senha"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  handleChange("password", text);
                  setPasswordEdited(true);
                }}
                onBlur={() => {
                  const isValid = validatePassword(formData.password);
                  setPasswordError(
                    isValid
                      ? null
                      : "A senha deve conter pelo menos 5 caracteres."
                  );
                }}
              />
              <TouchableOpacity
                style={tw`p-3 bg-gray-100 border-l border-gray-300`}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {passwordEdited && passwordError && (
              <Text style={tw`text-red-500 text-sm mt-1`}>{passwordError}</Text>
            )}
          </View>

          {/* Campo: Confirmar Senha */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Confirmar Senha
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                confirmError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="lock" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="Confirme a senha"
                secureTextEntry={!showPassword}
                value={formData.confirm_password}
                onChangeText={(text) => {
                  handleChange("confirm_password", text);
                  setConfirmEdited(true);
                }}
                onBlur={() =>
                  setConfirmError(
                    formData.password !== formData.confirm_password
                      ? "As senhas não coincidem."
                      : null
                  )
                }
              />
            </View>
            {confirmEdited && confirmError && (
              <Text style={tw`text-red-500 text-sm mt-1`}>{confirmError}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={enviarNovaSenha}
            style={tw`bg-indigo-600 p-3 rounded mt-2`}
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
