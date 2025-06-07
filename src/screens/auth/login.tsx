import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Usando Feather icons
import tw from "twrnc"; // Import twrnc

import {
  validateEmail,
  validatePassword,
} from "../../validations/input_validations";

interface GeneralMessage {
  type: "success" | "danger" | "";
  text: string;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [generalMessage, setGeneralMessage] = useState<GeneralMessage>({
    type: "",
    text: "",
  });

  const [emailEdited, setEmailEdited] = useState<boolean>(false);
  const [passwordEdited, setPasswordEdited] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  const handleEmailValidation = (inputEmail: string) => {
    const isValid = validateEmail(inputEmail);
    setEmailError(isValid); // true se inválido
    return isValid;
  };

  const handlePasswordValidation = (inputPassword: string) => {
    const isValid = validatePassword(inputPassword);
    setPasswordError(isValid); // true se inválido
    return isValid;
  };

  const handleLogin = (): void => {
    // Valide ambos os campos ao pressionar o botão de login usando as novas funções helper
    const isEmailValid = handleEmailValidation(email);
    const isPasswordValid = handlePasswordValidation(password);

    // Marque os campos como editados para mostrar feedback imediato
    setEmailEdited(true);
    setPasswordEdited(true);

    if (!isEmailValid && !isPasswordValid) {
      // Simulate API call for login
      console.log("Attempting login with:", { email, password });
      setGeneralMessage({ type: "success", text: "Login bem-sucedido!" });
      // Em uma aplicação real, você faria uma chamada de API aqui
    } else {
      setGeneralMessage({
        type: "danger",
        text: "Por favor, corrija os erros no formulário.",
      });
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-4`}>
      <View
        style={tw`flex-col rounded-xl shadow-lg max-w-2xl w-full bg-white overflow-hidden`}
      >
        {/* Form Section - Now contains the image and welcome message */}
        <View style={tw`flex-1 p-6 md:p-8 rounded-xl`}>
          {/* Moved Image and Welcome message here */}
          <View style={tw`items-center mb-6`}>
            {imageLoadError ? (
              <View
                style={tw`w-32 h-32 mb-2 bg-gray-300 items-center justify-center rounded-lg`}
              >
                <Text style={tw`text-gray-600 text-2xl font-bold`}>Logo</Text>
              </View>
            ) : (
              <Image
                source={require("../../assets/logo/logo.png")} // Confirme este caminho!
                style={tw`w-32 h-32 mb-2 object-contain`}
                resizeMode="contain"
                onError={() => setImageLoadError(true)}
              />
            )}
            <Text style={tw`text-2xl font-bold text-center text-gray-800`}>
              Bem-vindo(a)
            </Text>
          </View>

          {/* Flash Messages (like Bootstrap's alerts) */}
          {generalMessage.text ? (
            <View
              style={tw`p-3 mb-4 rounded ${
                generalMessage.type === "success"
                  ? "bg-green-100 border border-green-400"
                  : "bg-red-100 border border-red-400"
              }`}
            >
              <Text
                style={tw`${
                  generalMessage.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                } font-semibold`}
              >
                {generalMessage.text}
              </Text>
              <TouchableOpacity
                onPress={() => setGeneralMessage({ type: "", text: "" })}
                style={tw`absolute top-2 right-2 p-1`}
              >
                <Text style={tw`text-lg font-bold text-gray-600`}>&times;</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Email Input Field */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Email
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                emailError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="mail" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  setEmailEdited(true); // Marque como editado
                  handleEmailValidation(text); // Chama a função helper que usa a validação externa
                }}
                onBlur={() => handleEmailValidation(email)} // Chama a função helper
              />
              {/* Real-time validation icon for email */}
              {emailEdited &&
                email.length > 0 && ( // Só mostra o ícone se editado e não vazio
                  <View style={tw`p-3`}>
                    <Icon
                      name={emailError ? "x-circle" : "check-circle"} // 'x-circle' para erro, 'check-circle' para válido
                      size={20}
                      color={
                        emailError ? tw.color("red-500") : tw.color("green-500")
                      }
                    />
                  </View>
                )}
            </View>
            {/* Detailed validation feedback for email */}
            {emailError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input Field */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Senha
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="lock" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="Sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  setPasswordEdited(true); // Marque como editado
                  handlePasswordValidation(text); // Chama a função helper que usa a validação externa
                }}
                onBlur={() => handlePasswordValidation(password)} // Chama a função helper
              />
              {/* Toggle password visibility button */}
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

              {/* Real-time validation icon for password */}
              {passwordEdited &&
                password.length > 0 && ( // Só mostra o ícone se editado e não vazio
                  <View style={tw`p-3`}>
                    <Icon
                      name={passwordError ? "x-circle" : "check-circle"} // 'x-circle' para erro, 'check-circle' para válido
                      size={20}
                      color={
                        passwordError
                          ? tw.color("red-500")
                          : tw.color("green-500")
                      }
                    />
                  </View>
                )}
            </View>
            {/* Detailed validation feedback for password */}
            {passwordError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={tw`bg-blue-600 py-3 rounded-lg w-full items-center justify-center shadow-md active:bg-blue-700`}
            onPress={handleLogin}
          >
            <Text style={tw`text-white text-lg font-bold`}>Entrar</Text>
          </TouchableOpacity>

          {/* Register Section */}
          <View style={tw`mt-6 text-center items-center`}>
            <Text style={tw`text-gray-600 mb-3`}>Ainda não tem conta?</Text>
            <TouchableOpacity
              style={tw`border border-blue-500 py-3 rounded-lg w-3/4 items-center justify-center active:bg-blue-50`}
              // Em uma aplicação real, você navegaria para a tela de registro
              onPress={() =>
                Alert.alert(
                  "Navegar para Cadastro",
                  "Implementar navegação para a tela de cadastro aqui."
                )
              }
            >
              <Text style={tw`text-blue-600 text-base font-semibold`}>
                Cadastre-se agora
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
